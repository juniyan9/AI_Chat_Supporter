import express from "express";
import bodyParser from "body-parser"
import llama_run from "./generateContentLlama.js";
import http from "http"; // http 모듈 임포트
import https from 'https';


let app = express();
const llamaPostRouter = express.Router();

app.use(express.json()); //json 파일 처리


// Llama API 호출
llamaPostRouter.post("/", (req, res) => {
    // const userInput = req.body.input; // 요청에서 입력 데이터 추출
    // const model = req.body.model; // 모델 이름 추출

    // // 로컬 Llama API에 POST 요청 보내기
    // const options = {
    //     hostname: 'localhost',
    //     port: 11434, 
    //     path: '/api/generate',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // };

    // const request = http.request(options, (response) => {
    //     let data = '';

    //     // 데이터 조각을 수집
    //     response.on('data', (chunk) => {
    //         data += chunk;
    //     });

    //     // 모든 데이터가 수신된 후
    //     response.on('end', () => {
    //         console.log('Response status code:', response.statusCode); // 상태 코드 출력
    //         console.log('Response data:', data);
    //         if (response.statusCode === 200) {
    //             // 성공적으로 응답을 받았다면
    //             res.send({ LLMRes: JSON.parse(data) });
    //         } else {
    //             // 에러가 발생했을 경우
    //             res.status(response.statusCode).send('Error from Llama API');
    //         }
    //         // res.send({ LLMRes: JSON.parse(data) }); // 응답 반환
    //     });
    // });

    // // 오류 처리
    // request.on('error', (error) => {
    //     console.error(error);
    //     res.status(500).send('Error communicating with Llama');
    // });

    // // 요청 본문 작성
    // request.write(JSON.stringify({ model, input: userInput }));
    // request.end(); // 요청 종료

    const data = JSON.stringify({
        model: "llama3.1:8b",
        prompt: "대한민국의 역대 왕조를 소개해줄래?"
    });
    
    const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data) // Byte length를 정확하게 계산
        }
    };
    
    const request = http.request(options, (response) => {
        let body = '';

        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            console.log('Response:', body);
            try {
                res.json(JSON.parse(body)); // 클라이언트에게 응답 전달
            } catch (error) {
                console.error('Parsing error:', error);
                res.status(500).json({ error: 'Error parsing response' });
            }
        });
    });
    
    request.on('error', (error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
    
    // 요청에 데이터 쓰기
    request.write(data);
    request.end();
});

export default llamaPostRouter;
