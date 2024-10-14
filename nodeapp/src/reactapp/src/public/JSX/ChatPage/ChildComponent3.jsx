import React from 'react';
import '../../CSS/ChildComponent3.css';

const ChildComponent3 = ({ IntentionsAnalysisResult }) => { 
    if (!IntentionsAnalysisResult || !IntentionsAnalysisResult.analysisResult) {
        return <div>분석 결과가 없습니다.</div>;
    }

    return (
        <div className="ChildComponent3">
            <div className="analysis-content">
                <div className="text-details">
                    <p className="detail-item">
                        <span className="label">의도분석 결과:</span> {IntentionsAnalysisResult.analysisResult}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChildComponent3;
