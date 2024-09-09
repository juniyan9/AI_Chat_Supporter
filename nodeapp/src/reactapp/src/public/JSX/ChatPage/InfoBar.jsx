import '../../CSS/InfoBar.css';
import { useEffect, useState } from 'react';
import userIcon from '../../IMG/multiple_user_icon.png';
// import { io } from 'socket.io-client';

export default function InfoBar({ roomName, setonsearchtext, roomCount }) {
    const [search, setSearch] = useState('');

    const inputText = (e) => {
        const value = e.target.value;
        setSearch(value);
        setonsearchtext(value);
    };

    return (
        <div className="InfoBar">
            <h3>
                {roomName}&emsp;
                <img src={userIcon} alt="User Icon" className='userIcon' /> {roomCount}
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
