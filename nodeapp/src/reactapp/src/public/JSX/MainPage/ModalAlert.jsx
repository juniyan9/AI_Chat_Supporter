import React, { useEffect, useRef } from 'react';
import '../../CSS/ModalAlert.css';

export default function ModalAlert({isOpen,onClose,modalClose,setNickName}) {
  
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && buttonRef.current) {
        buttonRef.current.focus();
    }
  }, [isOpen]);


  const handleKeyPress = (e) => {
    onClose();
    modalClose();
    setNickName('');
  };

  return (
    <div className='main_modal' onKeyDown={handleKeyPress}>
      <button className='main_modal_button' onClick={handleKeyPress} ref={buttonRef}>확인</button>
      <div className='main_modal_content'>
        <p className='num1p'>ⓘ&nbsp;&nbsp;&nbsp;AI Chat Support</p>
        <p className='num2p'>이미 존재하는 닉네임입니다</p>
      </div>
    </div>
  )
  }