import React from "react"

import '../CSS/MainFrame.css';

import ChatFrame from "./ChatFrame"
import LogFrame from "./LogFrame"

export default function MainFrame() {
    return (
        <div className="MainFrame" style={{display:"flex"}}>
            <ChatFrame room={'room1'} name={'tester1'}/>
            <LogFrame />
        </div>
    );
}