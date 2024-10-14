import React from 'react';
import {useState} from 'react';
import ChildComponent1 from "./ChildComponent1";
import ChildComponent2 from "./ChildComponent2";
import ChildComponent3 from "./ChildComponent3";
import '../../CSS/AImodel.css';

export default function AImodel({ AIAnalysisResult, EmotionsAnalysisResult, IntentionsAnalysisResult }) { 
    const [activeComponent, setActiveComponent] = useState('child1');

    return (
        <div className="AImodel">
            <h1>AI Chat Supporter</h1>
            <button className={activeComponent === 'child2' ? 'button2 active' : 'button2'} onClick={() => setActiveComponent("child2")}>감정분석</button>
            <button className={activeComponent === 'child3' ? 'button3 active' : 'button3'} onClick={() => setActiveComponent("child3")}>의도분석</button>

            <div>
                {activeComponent === 'child2' && <ChildComponent2 EmotionsAnalysisResult={EmotionsAnalysisResult}/>}
                {activeComponent === 'child3' && <ChildComponent3 IntentionsAnalysisResult={IntentionsAnalysisResult}/>}
            </div>
        </div>
    )
}