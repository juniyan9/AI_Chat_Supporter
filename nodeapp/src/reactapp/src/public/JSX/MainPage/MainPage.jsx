import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import '../../CSS/MainPage.css';

export default function MainPage() {
    
    const [nickName, setNickName] = useState('');
    const navigate = useNavigate();

    const handleNickNameSubmit = () =>{
        if (nickName) {
            navigate('/chatListPage',{state:{'nickName':nickName}});
        }
    }
    
    const keypress = (e) => {
        if (e.key === 'Enter') {
            handleNickNameSubmit();
        }
      };

    return (
<<<<<<< HEAD
        <div className="MainPage">
            <div className="Main">
                <input type='text' name='nickName' placeholder="닉네임을 입력해주세요." onChange={(e)=>{setNickName(e.target.value)}} onKeyDown={keypress}></input>
                <button  onClick={handleNickNameSubmit}>입장하기</button>
=======
        <div className="pullpage">
            <div className="MainPage">
                <div className="Main">
                    <input type='text' name='nickName' placeholder="닉네임 입력" onChange={(e)=>{setNickName(e.target.value)}} onKeyDown={keypress}></input>
                    <button  onClick={handleNickNameSubmit}>Login</button>
                </div>
>>>>>>> fd36398dbbc8d56b1962c40214385dbb09c89639
            </div>
        </div>
    );
}