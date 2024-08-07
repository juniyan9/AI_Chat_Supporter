import '../CSS/Message.css';
import react from 'react';

export default function Message({name, text}) {

    return (
      <div className={"user-message"}>
        <p>
          {name} + {text}
        </p>
      </div>
    )
}