import React from "react"

import '../../CSS/ChatPage.css';

import ChatFrame from "./ChatFrame"
import LogFrame from "./LogFrame"
import { useLocation } from 'react-router-dom';

export default function ChatPage() {
    const location = useLocation();
    console.log('ChatPage:::', location.state);
    return (
        <div className="chatPage" style={{display:"flex"}}>
            <ChatFrame roomName={location.state.roomName} nickName={location.state.nickName}/>
            <LogFrame />
        </div>
    );
}