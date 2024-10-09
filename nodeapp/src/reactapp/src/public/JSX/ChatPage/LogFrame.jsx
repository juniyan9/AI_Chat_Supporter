import { React } from "react";

import '../../CSS/LogFrame.css';

import AImodel from "./AImodel";

export default function LogFrame({AIAnalysisResult}) {
    return (
        <div className="LogFrame">
            <AImodel 
            AIAnalysisResult={AIAnalysisResult} />
        </div>
    )
}