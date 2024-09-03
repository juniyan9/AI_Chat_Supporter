import '../../CSS/Message.css';

export default function Message({nickName, text, user1,css}) {

  
  


    return (
      <div className={user1 ? "user1" : "user2"}>
        <div className={user1 ? "username1" : "username2"}>{nickName}</div>
        <p className={css ? "true" : "false"}>
          {text}
        </p>
      </div>
    )
}