import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../CSS/MainPage.css';

export default function MainPage() {
    const [nickName, setNickName] = useState('');
    const navigate = useNavigate();

    const handleNickNameSubmit = async () => {
        if (nickName) {
            try {
                const response = await fetch('http://192.168.0.113:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nickName })
                });

                const result = await response.text();

                if (result === 'exist') {
                    alert('이미 존재하는 닉네임입니다.');
                    window.location.reload();
                } else if (result === 'non-existent') {
                    navigate('/chatListPage', { state: { nickName: nickName } });
                }
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

    return (
        <div className="pullpage">
            <div className="MainPage">
                <div className="Main">
                    <input 
                        type='text' 
                        name='nickName' 
                        placeholder="닉네임 입력" 
                        onChange={(e) => setNickName(e.target.value)} 
                        onKeyDown={keypress} 
                    />
                    <button onClick={handleNickNameSubmit}>Login</button>
                </div>
            </div>
        </div>
    );
}