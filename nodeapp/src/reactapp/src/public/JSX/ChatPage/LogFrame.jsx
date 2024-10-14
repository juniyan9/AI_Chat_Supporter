import { React } from "react";

import '../../CSS/LogFrame.css';

import AImodel from "./AImodel";

export default function LogFrame({AIAnalysisResult, EmotionsAnalysisResult, IntentionsAnalysisResult}) {
    return (
        <div className="LogFrame">
            <AImodel 
                AIAnalysisResult={AIAnalysisResult} 
                EmotionsAnalysisResult={EmotionsAnalysisResult}
                IntentionsAnalysisResult={IntentionsAnalysisResult}
            />
        </div>
    )
}