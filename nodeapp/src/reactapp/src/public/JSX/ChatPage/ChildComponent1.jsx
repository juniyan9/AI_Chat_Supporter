import React from "react";
import '../../CSS/ChildComponent1.css';

// export default function ChildComponent1() {
//     return(
//     <div>
//         감정분석
//     </div>
//     )
// }

const ChildComponent1 = ({ AIAnalysisResult }) => { // analysisResult를 prop으로 받아옴
    if (!AIAnalysisResult) {
        return <div>분석 결과가 없습니다.</div>; // 결과가 없을 경우 메시지 표시
    }

    const {emotion, sentiment, score} = AIAnalysisResult;
    console.log("childComponent!, analysisResult:", AIAnalysisResult)

    return (
        <div className="emotion-image">
        <div className="ChildComponent1">
            <h2>감정 분석 결과</h2>
            <p>감정: {emotion}</p>
            <p>긍부정: {sentiment}</p>
            <p>확률: {score}</p>
        </div>
        </div>
    );
};
export default ChildComponent1;
