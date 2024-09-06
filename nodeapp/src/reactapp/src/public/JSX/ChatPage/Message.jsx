import '../../CSS/Message.css';

export default function Message({nickName, text, user1,highlight}) {
    
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
      console.log(result);
      return result;
    };
    
    return (
      <div className={user1 ? "user1" : "user2"}>
        <div className={user1 ? "username1" : "username2"}>{nickName}</div>
        <p>
          {highlight !== '' ? highlighttext(text, highlight) : (<div>{text}</div>)}
        </p>
      </div>
    )
}