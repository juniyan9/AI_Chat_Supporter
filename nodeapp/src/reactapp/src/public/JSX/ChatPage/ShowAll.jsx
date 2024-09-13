import '../../CSS/ShowAll.css';

export default function ShowAll({text,isOpen,onClose}) {
  
  if (!isOpen) return null;


    return (
      <div className='text-overlay'>
        <div className='text-content'>
          <h2>대화내용</h2>
          <p className='textall'>{text}</p>
        </div>
        <button className='closebutton' onClick={onClose}>닫기</button>
      </div>
    )
}