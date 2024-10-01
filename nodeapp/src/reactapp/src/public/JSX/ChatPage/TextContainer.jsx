import React from "react"
import '../../CSS/TextContainer.css';
import { useState,useEffect,useRef } from "react";

export default function TextContainer({ socket, setMessages, nickName, roomName, isOwner,setShowModal}) {
    
    const [message, setMessage] = useState('');
    const [scrollon,setscrollon] = useState(false);
    const textareaRef = useRef(null);

    useEffect(()=>{
        const textarea = textareaRef.current;
        if(textarea){
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;

            const maxHeight = 72;
            if(textarea.scrollHeight > maxHeight){
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = 'auto';
                setscrollon(true);
            }else{
                textarea.style.overflowY = 'hidden';
                setscrollon(false);
            }
        }
    },[message])


    const handleLocalMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && message.trim() === '') {
            e.preventDefault();
        }else if (e.key === 'Enter') {
            handleSubmit();
        }
      };
    
    
    const handleSubmit = () => {

        if(message.trim() !== '' && message.length !== 0){
            socket.current.emit('message', message, roomName);
            console.log(`message보낼 때 ${roomName} 잘 받아옴`)

            
            setMessage('');
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                  nickName: nickName, 
                  text: message,
                  user1: true,
                }
              ]);
        }
    }
    const handleOpenModal = () => setShowModal(true);
    

    return (
        <div className="TextContainer">
                {isOwner ? (
                    <button onClick={handleOpenModal} className="settingsButton">
                        방 설정
                    </button>
                ) : <button>노방장</button>}
                <textarea
                    className="textinput"
                    name="message"
                    value={message}
                    onChange={handleLocalMessage}
                    onKeyDown={handleKeyPress}
                    ref={textareaRef}
                    style={{overflowY: scrollon ? 'auto' : 'hidden'}}
                
                />
                <button type="button" onClick={handleSubmit} className="forwarding"></button>
        </div>
    );
}
