import React from 'react';
import '../../CSS/ChildComponent2.css';

const ChildComponent2 = ({ EmotionsAnalysisResult }) => { 
    if (!EmotionsAnalysisResult || !EmotionsAnalysisResult.analysisResult) {
        return <div>분석 결과가 없습니다.</div>;
    }

    return (
        <div className="ChildComponent2">
            <div className="analysis-content">
                <div className="text-details">
                    <p className="detail-item">
                        <span className="label">감정분석 결과:</span> {EmotionsAnalysisResult.analysisResult}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChildComponent2;

