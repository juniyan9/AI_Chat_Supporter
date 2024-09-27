import '../../CSS/Message.css';
import {useState, useLayoutEffect,useRef} from 'react';
import ShowAll from './ShowAll';

export default function Message({nickName, text, user1, highlight}) {
  const [handleShowAll,setHandleShowAll] = useState(false);  
  const [overtext, setOvertext] = useState(false);
  const textRef = useRef(null);

  useLayoutEffect(()=>{
    const checkOvertext= () =>{
      if(textRef.current){
        const containerHeight = textRef.current.offsetHeight;
        setOvertext(containerHeight > 400);
      }      
    };
    checkOvertext();
  },[text,highlight]);

    const highlighttext = (text, highlight) => {
      let result = [];
      let count = 0;
      let index;
      
        while ((index = text.indexOf(highlight, count)) !== -1) {
          if (index > count) {
            result.push(
              <span key={`${count}-text`}>
                {text.slice(count, index)}
              </span>);
          }
          result.push(
            <span key={`highligt-${index}`}className='highlighttext'>
              {highlight}
            </span>);

          count = index + highlight.length;
        }
        if (count < text.length) {
          result.push(
            <span key={`text-${count}`}>
              {text.slice(count)}
            </span>);
        }
        return result;
      }


    return (
      <div className={user1 ? "user1" : "user2"}>
        <div className={user1 ? "username1" : "username2"}>{nickName}</div>
        <div className='usetext' ref={textRef}>
          {highlight !== '' ? highlighttext(text, highlight) : <p>{text}</p>}
          {overtext && !handleShowAll && (
          <button className="buttonstyle" onClick={() => setHandleShowAll(true)}>
          전체보기
          </button>
      )}
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
};