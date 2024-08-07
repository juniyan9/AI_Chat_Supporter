import '../CSS/MessageContainer.css';
import Message from './Message';


export default function MessageContainer({messages}) {

    console.log("MessageContainer props messages ::", messages);

    return (
        <div className="MessageContainer">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    {...message}
                />
            ))}
        </div>
    )
}