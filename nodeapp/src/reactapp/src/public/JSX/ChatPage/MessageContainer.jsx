import '../../CSS/MessageContainer.css';
import Message from './Message';
import React, { useEffect,useRef,useState,useLayoutEffect } from 'react';


export default function MessageContainer({messages,onsearchtext}) {

    const scrollRef=useRef();
    const highlightedRef = useRef(null);
    const [bottom,setBottom] = useState(false);
    const [usescrollup,setusescrollup] = useState(false);

    useEffect(()=>{
        const Scrollbutton = ()=>{
            const container = scrollRef.current;
            const Scrollup = container.scrollTop < container.scrollHeight - container.clientHeight -200 ;
            
            if (Scrollup) {
                setBottom(true);
                setusescrollup(true);
            }else{
                setBottom(false);
                setusescrollup(false);
            }
        }


        const container = scrollRef.current;
        container.addEventListener('scroll',Scrollbutton);

        

        return ()=>{
            container.removeEventListener('scroll',Scrollbutton);
        }
        

    },[]);


    useLayoutEffect(()=>{
        const scrolltoBottom = ()=>{
            const container = scrollRef.current;
        if(!usescrollup){
            if(highlightedRef.current){
                highlightedRef.current.scrollIntoView({behavior: 'auto',block:'end'});
            }else if(!usescrollup){
                container.scrollTop = container.scrollHeight;
            }
        }
    };
    requestAnimationFrame(scrolltoBottom);

    },[messages,onsearchtext,usescrollup]);

    const bottombutton = () =>{
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setusescrollup(false);
    }

    return (
        <div className="MessageContainer" ref={scrollRef}>
            {bottom&&(
                <button className='bottombutton' onClick={bottombutton}>
                    ▼
                </button>
            )}
            {messages.map((message, index) => {
                const isHighlighted = message.text.includes(onsearchtext);
                    return(
                    <div
                        key={index}
                        ref={isHighlighted ? highlightedRef : null}
                    >
                        <Message
                            highlight={isHighlighted ? onsearchtext : ''}
                            {...message}
                        />
                    </div>
                    )
            })}

        </div>
    )
}

// import React, { useState } from 'react';
// import '../../CSS/MessageContainer.css';
// import Message from './Message';



// export default function MessageContainer({ messages,onsearchtext }) {


//     // console.log("MessageContainer props messages ::", messages);
//     // 숨겨진 메시지의 인덱스를 추적하기 위한 상태
//     const [hiddenMessages, setHiddenMessages] = useState(new Set());
//     // 컨텍스트 메뉴의 위치와 가시성을 제어하기 위한 상태
//     const [contextMenu, setContextMenu] = useState({
//         visible: false,
//         x: 0,
//         y: 0,
//         messageIndex: null,
//     });
//     // 우클릭 시 컨텍스트 메뉴를 표시하는 핸들러
//     const handleContextMenu = (event, index) => {
//         event.preventDefault(); // 기본 우클릭 메뉴를 방지합니다.
//         // 클릭한 위치의 좌표와 메시지 인덱스를 설정하여 컨텍스트 메뉴를 표시합니다.
//         setContextMenu({
//             visible: true,
//             x: event.clientX,
//             y: event.clientY,
//             messageIndex: index,
//         });
//     };
//     // 컨텍스트 메뉴에서 숨기기 버튼을 클릭했을 때의 핸들러
//     const handleHideMessage = () => {
//         if (contextMenu.messageIndex !== null) {
//             setHiddenMessages(prevHiddenMessages => {
//                 const updatedHiddenMessages = new Set(prevHiddenMessages);
//                 updatedHiddenMessages.add(contextMenu.messageIndex);
//                 return updatedHiddenMessages;
//             });
//         }
//         // 컨텍스트 메뉴를 숨깁니다.
//         setContextMenu({ ...contextMenu, visible: false });
//     };
//     // 컨텍스트 메뉴를 닫는 핸들러
//     const handleClickOutside = () => {
//         if (contextMenu.visible) {
//             setContextMenu({ ...contextMenu, visible: false });
//         }
//     };


//     const filtermessages = messages.filter(msg =>
//         msg.text.includes(onsearchtext)
//     );
    
//     console.log('text',filtermessages);

//     //만약 안녕이 들어있다면 css를 변경해라



//     return (
//         <div className="MessageContainer" onClick={handleClickOutside}>
//             {messages.map((message, index) => (
//                 !hiddenMessages.has(index) && ( // 숨겨진 메시지는 렌더링하지 않습니다.
//                     <div
//                         key={index}
//                         onContextMenu={(event) => handleContextMenu(event, index)} // 우클릭 시 메시지를 숨깁니다.
//                     >
//                         <Message
//                             key={index}
//                             {...message}
//                         />
//                     </div>
//                 )
//             ))}
//             {contextMenu.visible && (
//                 <div
//                     className="context-menu"
//                     style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px`, position: 'absolute' }}
//                 >
//                     <button onClick={handleHideMessage}>삭제</button>
//                 </div>
//             )}
//         </div>
//     );
// }