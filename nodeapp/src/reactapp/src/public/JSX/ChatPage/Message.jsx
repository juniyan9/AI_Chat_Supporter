import '../../CSS/Message.css';

export default function Message({nickName, text, user1,highlight}) {


  
  
    const highligttext =text.split(highlight);
    // console.log(highligttext);
    
    // const test =highligttext.lastIndexOf();
    // console.log(test);
    


    return (
      <div className={user1 ? "user1" : "user2"}>
        <div className={user1 ? "username1" : "username2"}>{nickName}</div>
        <p>
          {highlight!=('') ? (<div>{highligttext[0]}<span className='highligttext'>{highlight}</span>{highligttext[1]}</div>) : (<div>{text}</div>)}
        </p>
      </div>
    )
}