import '../../CSS/ShowAll.css';

export default function ShowAll({text,isOpen,onClose}) {
  
  if (!isOpen) return null;


    return (
      <div className='text-overlay'>
        <div className='text-content'>
        <button className='closebutton1' onClick={onClose}>X</button>
          <h2>대화내용</h2>
          {text}
          <button className='closebutton2' onClick={onClose}>닫기</button>
        </div>
      </div>
    )
}