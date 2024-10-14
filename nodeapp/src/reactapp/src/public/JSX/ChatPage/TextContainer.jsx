import React from "react"
import '../../CSS/TextContainer.css';
// import AImodel from "./AImodel";
import { useState,useEffect,useRef } from "react";

export default function TextContainer({ socket, setMessages, nickName, roomName, isOwner, 
                                        setShowModal, texts, setAIAnalysisResult, setEmotionsAnalysisResult, setIntentionsAnalysisResult}) {
    const [message, setMessage] = useState('');
    const [scrollon,setscrollon] = useState(false);
    const textareaRef = useRef(null);

    useEffect(()=>{
        const textarea = textareaRef.current;
        if(textarea){
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;

            const maxHeight = 72;
            if(textarea.scrollHeight > maxHeight){
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = 'auto';
                setscrollon(true);
            }else{
                textarea.style.overflowY = 'hidden';
                setscrollon(false);
            }
        }
    },[message])


    const handleLocalMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && message.trim() === '') {
            e.preventDefault();
        }else if (e.key === 'Enter') {
            handleSubmit();
        }
      };
    
    
    const handleSubmit = () => {

        if(message.trim() !== '' && message.length !== 0){
            socket.current.emit('message', message, roomName);
            
            setMessage('');
            setMessages((prevMessages) => [
                ...prevMessages,
                { 
                  nickName: nickName, 
                  text: message,
                  user1: true,
                }
              ]);
        }
    }    

    const modal = () =>{
        setShowModal(true);
    }
    
    // AI 버튼 클릭 핸들로
    // const handleAIClick = () => {
    //     // texts 배열을 서버에 보냅니다.
    //     socket.current.emit('ai_analysis', {roomName, texts});
    //     // AI 분석 결과 수신
    //     socket.current.on('ai_analysis_result', (results) => {
    //         console.log('AI Analysis Result:', results);
    //         setAIAnalysisResult(results)
    //     });
    // };

    // gemini 감정분석
    const handleGeminiEmoClick = () => {
        // texts 배열을 서버에 보냅니다.
        socket.current.emit('gemini_emo_analysis', {roomName, texts});
        // AI 분석 결과 수신
        socket.current.on('gemini_emo_analysis_result', (results) => {
            console.log('Gemini Analysis Result:', results);
            setEmotionsAnalysisResult(results)
        });
    };

    // gemini 의도분석
    const handleGeminiIntentionsClick = () => {
        // texts 배열을 서버에 보냅니다.
        socket.current.emit('gemini_intentions_analysis', {roomName, texts});
        // AI 분석 결과 수신
        socket.current.on('gemini_intentions_analysis_result', (results) => {
            console.log('Gemini Analysis Result:', results);
            setIntentionsAnalysisResult(results)
        });
    };

    return (
        <div className="TextContainer">
            {isOwner ? (
                <button className="isOwner" onClick={modal}>방장</button>
                ):<button className="noOwner"></button>
                }
                <button onClick={handleGeminiEmoClick}>감정분석</button> {/* gemini 감정분석 버튼 */}
                <button onClick={handleGeminiIntentionsClick}>의도분석</button> {/* gemini 의도분석 버튼 */}
                <textarea
                    className="textinput"
                    name="message"
                    value={message}
                    onChange={handleLocalMessage}
                    onKeyDown={handleKeyPress}
                    ref={textareaRef}
                    style={{overflowY: scrollon ? 'auto' : 'hidden'}}
                
                />
                <button type="button" onClick={handleSubmit} className="forwarding"></button>
        </div>
    );
}
