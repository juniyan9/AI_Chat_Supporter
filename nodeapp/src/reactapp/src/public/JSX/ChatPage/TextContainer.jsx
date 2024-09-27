import React from "react"
import '../../CSS/TextContainer.css';
import { useState,useEffect,useRef } from "react";
import AImodel from "./AImodel"

export default function TextContainer({ socket, setMessages, nickName, roomName}) {
    
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
    

    return (
        <div className="TextContainer">
                <AImodel/>
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
