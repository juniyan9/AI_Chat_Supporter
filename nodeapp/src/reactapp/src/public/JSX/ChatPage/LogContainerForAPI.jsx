import React from 'react';
import {useState} from 'react';
import ChildComponent1 from "./ChildComponent1";
import ChildComponent2 from "./ChildComponent2";
import ChildComponent3 from "./ChildComponent3";
import '../../CSS/LogContainerForAPI.css';

export default function LogContainerForAPI() {
    const [activeComponent,setactiveComponent] = useState('child1');

    return (
        <div className="LogContainerForAPI">
            <h1>  AI Chat Support</h1>
            <button className={activeComponent === 'child1' ? 'button1 active': 'button1'} onClick={()=> setactiveComponent("child1")}>감정분석</button>
            <button className={activeComponent === 'child2' ? 'button2 active': 'button2'} onClick={()=> setactiveComponent("child2")}>채팅서포터</button>
            <button className={activeComponent === 'child3' ? 'button3 active': 'button3'} onClick={()=> setactiveComponent("child3")}>채팅피드백</button>

            <div>
                {activeComponent === 'child1' &&<ChildComponent1/>}
                {activeComponent === 'child2' &&<ChildComponent2/>}
                {activeComponent === 'child3' &&<ChildComponent3/>}
            </div>

        </div>
    )
}