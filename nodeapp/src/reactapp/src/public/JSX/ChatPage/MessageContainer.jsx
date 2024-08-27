// import '../../CSS/MessageContainer.css';
// import Message from './Message';
// import React, { useEffect,useRef } from 'react';


// export default function MessageContainer({messages}) {

//     console.log("MessageContainer props messages ::", messages);
    
//     const scrollRef = useRef();

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);
 
//     const scrollToBottom = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//         }
//     };


//     return (
//         <div className="MessageContainer" ref={scrollRef}>
//             {messages.map((message, index) => (
//                 <Message
//                     key={index}
//                     {...message}
//                 />
//             ))}
//         </div>
//     )
// }

import React, { useState, useEffect, useRef } from 'react';
import '../../CSS/MessageContainer.css';
import Message from './Message';

export default function MessageContainer({ messages, onMessagesUpdate }) {
    const scrollRef = useRef();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    // 숨겨진 메시지의 인덱스를 추적하기 위한 상태
    const [hiddenMessages, setHiddenMessages] = useState(new Set());

    // 삭제되지 않은 메시지 리스트를 상태로 관리
    const [filteredMessages, setFilteredMessages] = useState(messages);

    // messages나 hiddenMessages가 변경될 때마다 필터링된 메시지 리스트를 업데이트
    useEffect(() => {
        const updatedMessages = messages.filter((_, index) => !hiddenMessages.has(index));
        setFilteredMessages(updatedMessages);
        console.log("업데이트 된 배열 확인 :", updatedMessages); // 삭제 후 배열 확인
        onMessagesUpdate(updatedMessages); // 부모 컴포넌트(ChatFrame)로 updatedMessages 전달
    }, [messages, hiddenMessages]);

    // 컨텍스트 메뉴의 위치와 가시성을 제어하기 위한 상태
    const [contextMenu, setContextMenu] = useState({
        visible: false, 
        x: 0,
        y: 0,
        messageIndex: null,
    });

    // 우클릭 시 컨텍스트 메뉴를 표시하는 핸들러
    const handleContextMenu = (event, index) => {
        event.preventDefault(); // 기본 우클릭 메뉴를 방지합니다.
        // 클릭한 위치의 좌표와 메시지 인덱스를 설정하여 컨텍스트 메뉴를 표시합니다.
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            messageIndex: index,
        });
    };

    // 컨텍스트 메뉴에서 숨기기 버튼을 클릭했을 때의 핸들러
    const handleHideMessage = () => {
        if (contextMenu.messageIndex !== null) {
            setHiddenMessages(prevHiddenMessages => {
                const updatedHiddenMessages = new Set(prevHiddenMessages);
                updatedHiddenMessages.add(contextMenu.messageIndex);
                // console.log("Updated Hidden Messages Set ::", updatedHiddenMessages); // 숨겨진 메시지 확인
                return updatedHiddenMessages;
            });
        }
        // 컨텍스트 메뉴를 숨깁니다.
        setContextMenu({ ...contextMenu, visible: false });
    };

    // 컨텍스트 메뉴를 닫는 핸들러
    const handleClickOutside = () => {
        if (contextMenu.visible) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };

    return (
        <div className="MessageContainer" onClick={handleClickOutside} ref={scrollRef}>
            {filteredMessages.map((message, index) => (
                <div
                    key={index}
                    onContextMenu={(event) => handleContextMenu(event, index)} // 우클릭 시 메시지를 숨깁니다.
                >
                    <Message
                        key={index}
                        {...message}
                    />
                </div>
            ))}
            {contextMenu.visible && (
                <div
                    className="context-menu"
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px`, position: 'absolute' }}
                >
                    <button onClick={handleHideMessage}>삭제</button>
                </div>
            )}
        </div>
    );
}