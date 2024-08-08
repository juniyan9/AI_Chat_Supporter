import React from "react"
import '../../CSS/TextContainer.css';
import { useState } from "react";

/*
    TextContainer에서 보내기 버튼을 누르면 메세지를 서버로 전송해야함
    이 때 
    1. 보낸 메세지는 공백처리 > TextContainer 리렌더링
    2. 

*/
export default function TextContainer({ socket, setMessages, nickName, roomName }) {
    
    
    const [message, setMessage] = useState('');

    console.log('TextContainer message >>',message);


    const handleLocalMessage = (event) => {
        setMessage(event.target.value);
    }

    const handleSubmit = () => {

        if(message !== '' && message.length !== 0){
            socket.current.emit('message', message, roomName);
            /*
            setMessage('');
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                  nickName: nickName, 
                  text: message,
                },
              ]);
              */
        }
    }

    return (
        <div className="TextContainer">
            <input className="textinput"type="text" name="message" value={message} onChange={handleLocalMessage}/>
            <button type="button" onClick={handleSubmit}>보내기</button>
        </div>
    );
}
