import '../../CSS/InfoBar.css';
import { useEffect, useState } from 'react';
import userIcon from '../../IMG/multiple_user_icon.png';
// import { io } from 'socket.io-client';

export default function InfoBar({ roomName, setonsearchtext, roomCount, maxCount }) {
    const [search, setSearch] = useState('');

    const inputText = (e) => {
        const value = e.target.value;
        setSearch(value);
        setonsearchtext(value);
    };
    useEffect (()=> {
        // roomCount 변화 감지
        console.log(`Room 인원수 업데이트 : ${roomCount}`)
    }, [roomCount]); // roomCount가 변경될 때마다 이 useEffect 실행

    return (
        <div className="InfoBar">
            <h3>
                {roomName}&emsp;
                <img src={userIcon} alt="User Icon" className='userIcon' /> {roomCount}/{maxCount}
            </h3>
            <input
                className='searchtext'
                type="text"
                placeholder="검색"
                value={search}
                onChange={inputText}
            />
            <button className='barsearch'></button>
            <div className='line'></div>
        </div>
    );
}
