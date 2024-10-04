import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../../CSS/MainPage.css';
import ModalAlert from "./ModalAlert";

export default function MainPage() {
    const [nickName, setNickName] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [ShowalertModal,setShowAlertModal] =useState(false);

    useEffect(()=>{
        if(inputRef.current){
            inputRef.current.focus();
        }
    },[]);

    const handleNickNameSubmit = async () => {
        if (nickName) {
            try {
                const response = await fetch('http://localhost:5000/register', {
                    credentials : 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nickName })
                });

                const result = await response.text();
                // const trimnickname = nickName.replace(/\s+/g,'');

                if (result === 'exist') {
                    setShowAlertModal(true);
                } else if (result === 'non-existent') {
                    navigate('/ChatPage', { state: {nickName:nickName} });
                }
                // console.log(trimnickname);
                
            } catch (error) {
                console.log(error);
                alert('요청을 처리하는 도중 오류가 발생했습니다.');
            }
        }
    };

    const keypress = (e) => {
        if (e.key === 'Enter') {
            handleNickNameSubmit();
        }
    };
    const modalClose = () =>{
        if(inputRef.current){
            inputRef.current.focus();
        }
    }
    

    return (
        <div className="pullpage">
            <div className="MainPage">
                <div className="Main">
                <h1>AI Chat Support</h1>
                <h2>Transforming<br/>Conversations with<br/>Ai - Powered Support</h2>
                    <input 
                        type='text' 
                        name='nickName'
                        placeholder="닉네임 입력"
                        value={nickName.replace(/\s+/g,'')}
                        ref={inputRef}
                        onChange={(e) => setNickName(e.target.value)}
                        onKeyDown={keypress} 
                    />
                    <button onClick={handleNickNameSubmit}>Login</button>
                </div>
                {ShowalertModal && (
                    <ModalAlert
                        setNickName={setNickName}
                        isOpen={ShowalertModal}
                        onClose={()=>setShowAlertModal(false)}
                        modalClose={modalClose}
                    />
                )}
            </div>
        </div>
    );
}