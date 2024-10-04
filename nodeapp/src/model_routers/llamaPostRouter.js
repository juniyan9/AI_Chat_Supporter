import express from "express";
import bodyParser from "body-parser"
import llama_run from "./generateContentLlama.js";
import http from "http"; // http 모듈 임포트


let app = express();
const llamaPostRouter = express.Router();

app.use(express.json()); //json 파일 처리

// llamaPostRouter.post("/", async (req, res) => {
//   // console.log(req.body.message)
//   const LLMRes = await llama_run(req);
//   console.log('LLMRes', LLMRes)

//   res.send({ LLMRes: LLMRes });
// });

// export default llamaPostRouter;



// import express from "express";
// import llama_run from "./generateContentLlama.js";

// let app = express();
// const llamaPostRouter = express.Router();


// Llama API 호출
llamaPostRouter.post("/", (req, res) => {
    const userInput = req.body.input; // 요청에서 입력 데이터 추출

    // 로컬 Llama API에 POST 요청 보내기
    const options = {
        hostname: '43.203.141.146',
        port: 11434, // Llama API가 실행되는 포트
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const request = http.request(options, (response) => {
        let data = '';

        // 데이터 조각을 수집
        response.on('data', (chunk) => {
            data += chunk;
        });

        // 모든 데이터가 수신된 후
        response.on('end', () => {
            res.send({ LLMRes: JSON.parse(data) }); // 응답 반환
        });
    });

    // 오류 처리
    request.on('error', (error) => {
        console.error(error);
        res.status(500).send('Error communicating with Llama');
    });

    // 요청 본문 작성
    request.write(JSON.stringify({ input: userInput }));
    request.end(); // 요청 종료
});

export default llamaPostRouter;
