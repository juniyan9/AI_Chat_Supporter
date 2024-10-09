import React from 'react';
import {useState} from 'react';
import ChildComponent1 from "./ChildComponent1";
import ChildComponent2 from "./ChildComponent2";
import ChildComponent3 from "./ChildComponent3";
import '../../CSS/AImodel.css';

// export default function AImodel() {
//     const [activeComponent,setactiveComponent] = useState('child1');

//     return (
//         <div className="AImodel">
//             <h1>  AI Chat Support</h1>
//             <button className={activeComponent === 'child1' ? 'button1 active': 'button1'} onClick={()=> setactiveComponent("child1")}>감정분석</button>
//             <button className={activeComponent === 'child2' ? 'button2 active': 'button2'} onClick={()=> setactiveComponent("child2")}>챗서포터</button>
//             <button className={activeComponent === 'child3' ? 'button3 active': 'button3'} onClick={()=> setactiveComponent("child3")}>챗피드백</button>

//             <div>
//                 {activeComponent === 'child1' &&<ChildComponent1/>}
//                 {activeComponent === 'child2' &&<ChildComponent2/>}
//                 {activeComponent === 'child3' &&<ChildComponent3/>}
//             </div>

//         </div>
//     )
// }

export default function AImodel({ AIAnalysisResult }) { 
    const [activeComponent, setActiveComponent] = useState('child1');

    return (
        <div className="AImodel">
            <h1>AI Chat Support</h1>
            <button className={activeComponent === 'child1' ? 'button1 active' : 'button1'} onClick={() => setActiveComponent("child1")}>감정분석</button>
            <button className={activeComponent === 'child2' ? 'button2 active' : 'button2'} onClick={() => setActiveComponent("child2")}>챗서포터</button>
            <button className={activeComponent === 'child3' ? 'button3 active' : 'button3'} onClick={() => setActiveComponent("child3")}>챗피드백</button>

            <div>
                {activeComponent === 'child1' && <ChildComponent1 AIAnalysisResult={AIAnalysisResult} />} {/* analysisResult를 ChildComponent1에 전달 */}
                {activeComponent === 'child2' && <ChildComponent2 />}
                {activeComponent === 'child3' && <ChildComponent3 />}
            </div>
        </div>
    )
}