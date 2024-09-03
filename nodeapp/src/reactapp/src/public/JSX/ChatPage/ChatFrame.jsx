// import React, { useState, useEffect, useRef } from "react"

// import '../../CSS/ChatFrame.css';
// import io from 'socket.io-client';
// import InfoBar from "./InfoBar"
// import MessageContainer from "./MessageContainer"
// import TextContainer from "./TextContainer"

// export default function ChatFrame(props) {
    
//     console.log('ChatFrame Rerendered');
    
//     const [messages, setMessages] = useState([]);
//     const [roomName, setRoomName] = useState(props.roomName);
//     const [nickName, setNickName] = useState(props.nickName);
    
    
//     console.log('ChatFrame roomName>>',roomName);
//     console.log('ChatFrame nickName>>',nickName);

//     const socket = useRef(null);
    
//     useEffect(() => {
//       socket.current = io('http://192.168.0.113:5050');
//         socket.current.on('connect', () => {
//           console.log('Connected to server');
//           // 룸 입장 emit
//           socket.current.emit('enter_room', nickName, roomName);
//         });
        
//         // 서버 메세지 대기
//         socket.current.on('reply', (reply_message, nickName) => {
//           console.log('From server ::', reply_message);

//           // 채팅 메세지 업데이트
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { 
//               nickName: nickName,
//               text: reply_message,
//             },
//           ]);


//         });
    
//         return () => {
//           socket.current.disconnect(); // 컴포넌트 언마운트 시 연결 종료
//         };
//     }, []);

//     return (
//             <div className="ChatFrame">
//                 <InfoBar roomName={roomName}/>
//                 <MessageContainer messages={messages}/>               
//                 <TextContainer socket={socket} setMessages={setMessages} nickName={nickName} roomName={roomName} messages={messages}/>
//             </div>
//     );
    
// };

import React, { useState, useEffect, useRef } from "react";
import '../../CSS/ChatFrame.css';
import io from 'socket.io-client';
import InfoBar from "./InfoBar";
import MessageContainer from "./MessageContainer";
import TextContainer from "./TextContainer";

export default function ChatFrame(props) {
    
    // console.log('ChatFrame Rerendered');
    
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState(props.roomName);
    const [nickName, setNickName] = useState(props.nickName);
    const [onsearchtext, setonSearchText] = useState('');

    const socket = useRef(null);
    
    useEffect(() => {
        socket.current = io('http://192.168.0.113:5050');  // 서버 URL로 수정 필요
        socket.current.on('connect', () => {
            console.log('Connected to server');
            // 룸 입장 emit
            socket.current.emit('enter_room', nickName, roomName);
        });
        
        // 서버 메세지 대기
        socket.current.on('reply', (reply_message, nickName) => {
            console.log('From server ::', reply_message);

            // 채팅 메세지 업데이트
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                    nickName: nickName,
                    text: reply_message,
                },
            ]);
        });
    
        return () => {
            socket.current.disconnect(); // 컴포넌트 언마운트 시 연결 종료
        };
    }, []);

    // MessageContainer에서 updatedMessages를 전달받아 백엔드로 전송하는 함수
    const handleMessagesUpdate = (updatedMessages) => {
        if (socket.current) {
            const dataToSend = updatedMessages.map((message, index) => ({
                NickName: nickName,
                MESSAGE_ID: index + 1,  // 현재 단순히 인덱스로 구현함 식제로 구현할때는 고유값 필요함 !!내일 다시 확인해보기!!
                MESSAGE: message.text,  
                ROOMNAME: roomName,  
                DATE: new Date().toISOString() // !!내일 다시 확인해보기!!
            }));

            socket.current.emit('update_messages', dataToSend); // 서버로 데이터 전송
            console.log("백엔드에 보낸 데이터 :", dataToSend);
        } else {
            console.error("소켓이 아직 초기화가 되질 않음");
        }
    };    

    return (
        <div className="ChatFrame">
            <InfoBar
                roomName={roomName}
                onsearchtext={setonSearchText}
            />
            <MessageContainer 
                messages={messages}
                onsearchtext={onsearchtext}
                onMessagesUpdate={handleMessagesUpdate} // 메시지 업데이트 콜백 전달
            />
            <TextContainer 
                socket={socket} 
                setMessages={setMessages} 
                nickName={nickName} 
                roomName={roomName}
            />
        </div>
    );
}



