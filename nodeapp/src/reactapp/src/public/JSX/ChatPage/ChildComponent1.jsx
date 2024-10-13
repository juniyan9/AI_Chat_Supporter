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
