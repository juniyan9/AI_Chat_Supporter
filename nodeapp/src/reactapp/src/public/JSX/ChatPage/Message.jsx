import '../../CSS/Message.css';

export default function Message({nickName, text, user1}) {

  
  


    return (
      <div className={user1 ? "user1" : "user2"}>
        <div className={user1 ? "username1" : "username2"}>{nickName}</div>
        <p>
          {text}
        </p>
      </div>
      // <div  className='user1'>
        
      //   <p>
      //     {nickName}:{text}
      //   </p>

      // </div>
    )
}