import React, { useState } from 'react';
import '../../CSS/PasswordModal.css'; // 필요시 스타일 추가

export default function PasswordModal({ isOpen, onClose, onSubmit }) {
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onSubmit(password);
    };

    if (!isOpen) return null;

    return (
        <div className="password-modal-overlay">
            <div className="password-modal">
                <h2>비밀번호 입력</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                />
                <button onClick={handleSubmit}>확인</button>
                <button onClick={onClose}>취소</button>
            </div>
        </div>
    );
}
