import React, { useEffect, useState } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";
import RoomSettingsModal from './RoomSettingsModal';


export default function ChatFrame({UserName, room, socket, roomCount, setRoomCount, roomName, setRoomName, password, setPassword, isPrivate, setIsPrivate, maxCount, setMaxCount, timeoutId, setTimeoutId,ownerNickname,setOwnerNickName,setIsSocketConnected, setAIAnalysisResult,setEmotionsAnalysisResult, setIntentionsAnalysisResult}) {
    const [onsearchtext, setonSearchText] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState([]);
    
    // console.log('chatframe유저네임props',UserName); //유저닉네임
    // console.log('chatframe룸props',room); //count,id,isprivate,maxcount,name(roomname),ownerid,ownernickname,password
    // console.log('chatframe소켓props',socket);//이미 연결되있음 effect가 먼저 동작이 끝난후 페이지가 랜더링 되니깐 누르는 방 순간 들어가지는게 맞음
    // console.log('chatframe룸카운트props',roomCount); //들어온 사람숫자
    // console.log('chatframe룸이름21',roomName); //뜨다가 소켓이 연결되면서 사라짐
    // console.log('chatframe비밀번호props',password); //비밀번호 없으면 null
    // console.log('chatframe비공개props',isPrivate); //비밀방 설정 여부
    // console.log('chatframe맥스카운트props',maxCount); // 최대인원수
    

    
    useEffect(() => {
        if(room && !socket.current){
            // console.log('chatframe룸이름30',roomName);
            if(room && room.count < room.maxCount){
                
                socket.current = io('http://localhost:9090');
                socket.current.on('connect', () => {
                socket.current.emit('enter_room', UserName, room.name);

                setMessages([]);
                setIsSocketConnected(true);

                if (timeoutId) {
                    // console.log("clearTimeout 전 timeoutId:", timeoutId)
                    clearTimeout(timeoutId); // 타이머 해제
                    console.log("소켓에서 timeoutId 지웠습니다.")
                    setTimeoutId(0)
                    console.log("소켓에서 timeoutId 만료 후 timeoutId:", timeoutId)
                }
                
                //console.log('룸',room); //count,룸id,private,maxcount,name(roomname),ownerid,ownernickname,password
                
            })
            }else{
                alert('방이 꽉찼습니다');
                return;
            }

            socket.current.on('roomCountUpdate', (count) => {
                //console.log('chatframe카운트',count); 
                setRoomCount(count); // roomCount 업데이트
            });
                        
            // console.log("chatframe소켓 연결확인1",socket.current);//연결잘됌
            // console.log("chatframe소켓 연결확인2",socket);//연결잘됌

            // 방장 여부 설정
            setIsOwner(UserName === ownerNickname); // 방장이면 true로 설정

            socket.current.on('newOwnerNickName', (newOwnerNickName) => {
                console.log('newOwnerNickName:', newOwnerNickName); 
                console.log('isOwner:', isOwner)
                setIsOwner(UserName === newOwnerNickName); // roomCount 업데이트
            }); 


            socket.current.on('roomDeleted', (data) => {
                // console.log("chatframe딜리티드속 데이터 :",data); //방장닉네임
                if (data) {
                    alert("방장이 방을 삭제하였습니다.");
                    setIsSocketConnected(false);
                }
            })


            socket.current.on('reply', (reply_message, nickName) => {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { nickName, text: reply_message },
                ]);
                //console.log('chatframe리플라이메세지',reply_message); //입장메세지
                //console.log('chatframe닉네임',nickName); //알리미
            });
        }
        // 소켓 연결 해제
        return ()=>{
            if(socket.current){
                socket.current.close();
                socket.current =null;
                setIsSocketConnected(false);
                setIsOwner(false);  // 방을 나갈 때 방장 여부를 false로 설정
            }
        };
    }, [UserName, room, ownerNickname]);

    const texts = messages
        .filter(messages => messages.nickName !== "알리미")
        .map(messages => messages.text);

    console.log("메시지 내용들:", texts);


    // 방 정보 업데이트 핸들러
    const handleUpdateRoom = (updatedRoomDetails) => {
        setRoomName(updatedRoomDetails.name);
        setMaxCount(updatedRoomDetails.maxCount);
        setPassword(updatedRoomDetails.password);
        setIsPrivate(updatedRoomDetails.isPrivate);
        console.log('chatframe업데이트룸디테일즈',updatedRoomDetails);
    };
    const handleCloseModal = () => setShowModal(false);


    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={room.name} // 업데이트된 . 방이름 사용
                setonsearchtext={setonSearchText}
                roomCount={roomCount}
                maxCount = {maxCount}      // 업데이트된 최대 인원수 사용
                isPrivate={isPrivate}      // 업데이트된 비공개 여부 사용
                password={password}
            />
            <MessageContainer
                messages={messages}
                onsearchtext={onsearchtext}
            />
            <TextContainer
                socket={socket} 
                setMessages={setMessages} 
                nickName={UserName} 
                roomName={room.name}
                isOwner={isOwner}
                handleUpdateRoom={handleUpdateRoom}
                texts={texts}
                setAIAnalysisResult={setAIAnalysisResult}
                setEmotionsAnalysisResult={setEmotionsAnalysisResult}
                setIntentionsAnalysisResult={setIntentionsAnalysisResult}
                setShowModal={setShowModal}
            />
            {showModal && (
                <RoomSettingsModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateRoom}
                    socket={socket}
                    roomDetails={{ 
                        name: roomName,
                        maxCount: maxCount,
                        password: password,
                        isPrivate: isPrivate,
                        ownerNickname: ownerNickname,
                        nickName: UserName
                    }}
                />
            )}
        </div>
    );
}
