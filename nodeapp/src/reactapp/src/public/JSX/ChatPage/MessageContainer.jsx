// import '../../CSS/MessageContainer.css';
// import Message from './Message';


// export default function MessageContainer({messages}) {

//     console.log("MessageContainer props messages ::", messages);

//     return (
//         <div className="MessageContainer">
//             {messages.map((message, index) => (
//                 <Message
//                     key={index}
//                     {...message}
//                 />
//             ))}
//         </div>
//     )
// }

import React, { useState } from 'react';
import '../../CSS/MessageContainer.css';
import Message from './Message';
export default function MessageContainer({ messages }) {
    console.log("MessageContainer props messages ::", messages);
    // 숨겨진 메시지의 인덱스를 추적하기 위한 상태
    const [hiddenMessages, setHiddenMessages] = useState(new Set());
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
        <div className="MessageContainer" onClick={handleClickOutside}>
            {messages.map((message, index) => (
                !hiddenMessages.has(index) && ( // 숨겨진 메시지는 렌더링하지 않습니다.
                    <div
                        key={index}
                        onContextMenu={(event) => handleContextMenu(event, index)} // 우클릭 시 메시지를 숨깁니다.
                    >
                        <Message
                            key={index}
                            {...message}
                        />
                    </div>
                )
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