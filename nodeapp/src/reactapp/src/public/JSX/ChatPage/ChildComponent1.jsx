// import React from "react";
// import '../../CSS/ChildComponent1.css';

// export default function ChildComponent1() {
//     return(
//     <div>
//         감정분석
//     </div>
//     )
// }

// const ChildComponent1 = ({ AIAnalysisResult }) => { // analysisResult를 prop으로 받아옴
//     if (!AIAnalysisResult) {
//         return <div>분석 결과가 없습니다.</div>; // 결과가 없을 경우 메시지 표시
//     }

//     const {emotion, sentiment, score} = AIAnalysisResult;
//     console.log("childComponent!, analysisResult:", AIAnalysisResult)

//     return (
//         <div className="emotion-image">
//         <div className="ChildComponent1">
//             <h2>감정 분석 결과</h2>
//             <p>감정: {emotion}</p>
//             <p>긍부정: {sentiment}</p>
//             <p>확률: {score}</p>
//         </div>
//         </div>
//     );
// };
// export default ChildComponent1;


import React from 'react';
import '../../CSS/ChildComponent1.css';

const ChildComponent1 = ({ AIAnalysisResult }) => { // analysisResult를 prop으로 받아옴
    if (!AIAnalysisResult) {
        return <div>분석 결과가 없습니다.</div>; // 결과가 없을 경우 메시지 표시
    }

    const { emotion, sentiment, score } = AIAnalysisResult;

    return (
        <div className="ChildComponent1">
            <div className="analysis-content">
                <div className="emotion-image"></div>
                <div className="text-details">
                    <p className="detail-item"><span className="label">감정분석 결과:</span> {emotion}</p>
                    <p className="detail-item"><span className="label">감성분석 결과:</span> {sentiment}</p>
                    <p className="detail-item"><span className="label">확률:</span> {score}%</p>
                </div>
            </div>
        </div>
    );
};

export default ChildComponent1;
