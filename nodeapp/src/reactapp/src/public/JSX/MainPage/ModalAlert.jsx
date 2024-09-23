import React, { useEffect, useRef } from 'react';
import '../../CSS/ModalAlert.css';

export default function ModalAlert({isOpen,onClose,setNickName}) {
  
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && buttonRef.current) {
        buttonRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyPress = (e) => {
    onClose();
    setNickName('');
  };

  return (
    <div className='main_modal' onKeyDown={handleKeyPress}>
      <button className='main_modal_button' onClick={handleKeyPress} ref={buttonRef}>확인</button>
      <div className='main_modal_content'>
        <p>중복닉네임입니다</p>
      </div>
    </div>
  )
  }