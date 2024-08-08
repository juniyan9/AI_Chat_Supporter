import '../../CSS/Message.css';

export default function Message({nickName, text}) {

  
  


    return (
      <div className={"user-message"}>
        <p>
          {nickName}: {text}
        </p>
      </div>
    )
}