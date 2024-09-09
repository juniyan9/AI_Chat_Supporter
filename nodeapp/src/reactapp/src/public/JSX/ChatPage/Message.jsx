import '../../CSS/Message.css';
import {useState} from 'react';
import ShowAll from './ShowAll';

export default function Message({nickName, text, user1,highlight}) {
  const [handleShowAll,setHandleShowAll] = useState(false);  

    const highlighttext = (text, highlight) => {
      let result = [];
      let count = 0;
      let index;      
  
      while ((index = text.indexOf(highlight, count)) !== -1) {
        if (index > count) {
          result.push(<span key={count}>{text.slice(count, index)}</span>);
        }
        result.push(<span key={index} className='highlighttext'>{highlight}</span>);
  
        count = index + highlight.length;
      }
      if (count < text.length) {
        result.push(<span key={count}>{text.slice(count)}</span>);
      }
      return result;
    };

    const testtext = (text) =>{
      let test = text.length;
      let test2 = [];

      if(test >= 348){
        test2.push(<div className='buttontext'><p className='alltext'>{text}</p><button className='buttonstyle' onClick={()=>setHandleShowAll(true)}>전체보기</button></div>)
      }else{
        test2.push(<p>{text}</p>)
      }
      return test2;
    }

    return (
      <div className={user1 ? "user1" : "user2"}>
        <div className={user1 ? "username1" : "username2"}>{nickName}</div>
        <div className='usetext'>
          {highlight !== '' ? highlighttext(text, highlight) : testtext(text)}
        </div>
        {handleShowAll && (
          <ShowAll
            text={text}
            isOpen={handleShowAll}
            onClose={()=>setHandleShowAll(false)}
          />
        )}
      </div>
      
    )
}