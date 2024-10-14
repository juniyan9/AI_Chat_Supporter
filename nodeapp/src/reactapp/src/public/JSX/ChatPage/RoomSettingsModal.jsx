import React, { useState, useEffect } from "react";
import '../../CSS/RoomSettingsModal.css';



export default function RoomSettingsModal({ isOpen, onClose, roomDetails, onUpdate, onDelete, socket}) {
    const [roomName, setRoomName] = useState(roomDetails?.name || '');
    const [maxCount, setMaxCount] = useState(roomDetails?.maxCount || 10);
    const [password, setPassword] = useState(roomDetails?.password || '');
    const [isPrivate, setIsPrivate] = useState(roomDetails?.isPrivate || false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [count, setCount] = useState(roomDetails?.count || 0);

    useEffect(() => {
        if (roomDetails) {
            setRoomName(roomDetails.name);
            setMaxCount(roomDetails.maxCount);
            setPassword(roomDetails.password);
            setIsPrivate(roomDetails.isPrivate);
            setCount(roomDetails.count);
            // 필요하다면 이 부분에서 ownerNickname을 로그로 찍어 확인
        }
    }, [roomDetails]);

    //console.log("룸디테일즈 방장닉네임" , roomDetails.ownerNickname); //방장 닉네임뜸
    //console.log(roomDetails); isprivate,maxCount,name,nickName,ownerNickname,password

    const handleSave = () => {
        if (roomName.trim() === '') {
            alert('방 이름을 입력하세요.');
            return;
        }

        setIsSaving(true);

        // 소켓을 통해 서버로 방 업데이트 요청을 전송
        socket.current.emit('room_updated', {
            originalName: roomDetails.name,
            updatedName: roomName,
            ownerNickname: roomDetails.ownerNickname,
            updatedMaxCount: maxCount,
            updatedPassword: password,
            updatedIsPrivate: isPrivate,
            count: count, // 현재 인원 수 포함
        });

        // 서버에서 업데이트 결과를 받는 이벤트 리스너 설정
        socket.current.on('update_room_response', (response) => {
            setIsSaving(false);
            console.log("response:", response)

            if (response) {
                alert('방 정보가 업데이트되었습니다.');

                // UI를 업데이트하는 함수 호출
                onUpdate({
                    name: roomName,
                    maxCount,
                    password,
                    isPrivate,
                    count: response.count, // 서버에서 받은 새로운 count
                    ownerNickname: roomDetails.ownerNickname,
                    id: response.id,
                });

                onClose();
            } else {
                alert('방 정보 업데이트에 실패했습니다.');
                console.error('Failed to update room:', response.error);
            }
        });
    };

    const handleDelete = async () => {
        if (window.confirm("정말로 방을 삭제하시겠습니까?")) {
            setIsDeleting(true);
            socket.current.emit('delete_room',roomName)
            setIsDeleting(false);  // 삭제 상태 리셋
        }
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>방 설정</h2>
                    <label>
                        방 이름:
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            disabled={true}
                        />
                    </label>
                    <label>
                        최대 인원: {maxCount}
                        <input
                            type="range"
                            min="2"
                            max="10"
                            step="1"
                            value={maxCount}
                            onChange={(e) => setMaxCount(Number(e.target.value))}
                            className="slider"
                            disabled={isSaving || isDeleting}
                        />
                    </label>
                    <label>
                        비밀번호:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!isPrivate || isSaving || isDeleting}
                        />
                    </label>
                    <label>
                        비공개:
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            disabled={isSaving || isDeleting}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button onClick={handleSave} disabled={isSaving || isDeleting}>
                            {isSaving ? '저장 중...' : '저장'}
                        </button>
                        <button onClick={onClose} disabled={isSaving || isDeleting}>닫기</button>
                        <button onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? '삭제 중...' : '방 삭제'}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}



// import React, { useState, useEffect } from "react";
// import '../../CSS/RoomSettingsModal.css';



// const SERVER_URL = 'http://localhost:9000';

// export default function RoomSettingsModal({ isOpen, onClose, roomDetails, onUpdate, onDelete, socket}) {
//     const [roomName, setRoomName] = useState(roomDetails?.name || '');
//     const [maxCount, setMaxCount] = useState(roomDetails?.maxCount || 10);
//     const [password, setPassword] = useState(roomDetails?.password || '');
//     const [isPrivate, setIsPrivate] = useState(roomDetails?.isPrivate || false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [count, setCount] = useState(roomDetails?.count || 0);

//     useEffect(() => {
//         if (roomDetails) {
//             setRoomName(roomDetails.name);
//             setMaxCount(roomDetails.maxCount);
//             setPassword(roomDetails.password);
//             setIsPrivate(roomDetails.isPrivate);
//             setCount(roomDetails.count);
//             // 필요하다면 이 부분에서 ownerNickname을 로그로 찍어 확인
//         }
//     }, [roomDetails]);

//     //console.log("룸디테일즈 방장닉네임" , roomDetails.ownerNickname); //방장 닉네임뜸
//     //console.log(roomDetails); isprivate,maxCount,name,nickName,ownerNickname,password

//     const handleSave = async () => {
//         // console.log(roomDetails.ownerNickname);
        
//         if (roomName.trim() === '') {
//             alert('방 이름을 입력하세요.');
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const response = await fetch(`${SERVER_URL}/update_room`, {
                
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     originalName: roomDetails.name,
//                     updatedName: roomName,
//                     ownerNickname : roomDetails.ownerNickname,
//                     updatedMaxCount: maxCount,
//                     updatedPassword: password,
//                     updatedIsPrivate: isPrivate,
//                     count : count, // 현재 인원 수 포함
//                 }),
            
//             });
//             const data = await response.json();
//             console.log("서버에게 받은 업데이트 된 방 정보 :", data.data);

            
//             if (response.ok) {
//                 setIsSaving(false);
//                 alert('방 정보가 업데이트되었습니다.');

//                 onUpdate({ 
//                     name: roomName,
//                     maxCount, 
//                     password, 
//                     isPrivate,
//                     count : data.data.count, // 여기서 받은 count를 포함
//                     ownerNickname : roomDetails.ownerNickname, //소유자 닉네임
//                     id : data.data.id,
                    
//                 });
//                 onClose();
            
//             } else {
//                 const errorData = await response.json();
//                 alert('방 정보 업데이트에 실패했습니다.');
//                 console.error('Failed to update room:', errorData.error);
//                 setIsSaving(false);
//             }
//         } catch (error) {
//             setIsSaving(false);
//             alert('서버와의 통신 중 오류가 발생했습니다.');
//             console.error('Failed to update room:', error);
//         }
//     };

//     const handleDelete = async () => {
//         if (window.confirm("정말로 방을 삭제하시겠습니까?")) {
//             setIsDeleting(true);
//             socket.current.emit('delete_room',roomName)
//             setIsDeleting(false);  // 삭제 상태 리셋
//         }
//     };

//     return (
//         isOpen && (
//             <div className="modal-overlay">
//                 <div className="modal-content">
//                     <h2>방 설정</h2>
//                     <label>
//                         방 이름:
//                         <input
//                             type="text"
//                             value={roomName}
//                             onChange={(e) => setRoomName(e.target.value)}
//                             disabled={isSaving || isDeleting}
//                         />
//                     </label>
//                     <label>
//                         최대 인원: {maxCount}
//                         <input
//                             type="range"
//                             min="2"
//                             max="10"
//                             step="1"
//                             value={maxCount}
//                             onChange={(e) => setMaxCount(Number(e.target.value))}
//                             className="slider"
//                             disabled={isSaving || isDeleting}
//                         />
//                     </label>
//                     <label>
//                         비밀번호:
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             disabled={isSaving || isDeleting}
//                         />
//                     </label>
//                     <label>
//                         비공개:
//                         <input
//                             type="checkbox"
//                             checked={isPrivate}
//                             onChange={(e) => setIsPrivate(e.target.checked)}
//                             disabled={isSaving || isDeleting}
//                         />
//                     </label>
//                     <div className="modal-buttons">
//                         <button onClick={handleSave} disabled={isSaving || isDeleting}>
//                             {isSaving ? '저장 중...' : '저장'}
//                         </button>
//                         <button onClick={onClose} disabled={isSaving || isDeleting}>닫기</button>
//                         <button onClick={handleDelete} disabled={isDeleting}>
//                             {isDeleting ? '삭제 중...' : '방 삭제'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         )
//     );
// }
