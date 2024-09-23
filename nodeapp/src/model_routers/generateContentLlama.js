// function generateContent(prompt){
// console.log("prompt:", prompt)
//     return fetch('http://43.203.141.146:11434/api/chat', {
//         // "model": "llama3.1",
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "model": "llama3.1:8b",
//             "messages": [
//                 {
//                   "role": "user",
//                   "content": "안녕"
//                 }
//               ],
//             "prompt": prompt,

//             "stream": false,
//         })
//     })
//     .then((response) => {response.json()
// console.log("response:", response)

//     })  
//     .then((data => data));
// }

// export const llama_run = async (prompt) => {
    
//     const response = await generateContent(prompt);
//     console.log("response:", response)
//     return response;
// }

// export default llama_run;

function generateContent(req){
    return fetch('http://localhost:11434/api/chat', {
        // "model": "llama3.1",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "model": "llama3.1:8b",
            "messages": [
                {
                  "role": "user",
                  "content": req.body.prompt
                }
              ],

            "stream": false,
        })
    })
    .then((response) => response.json())  
    .then(data => {return data.message.content});
}

export const llama_run = async (req) => {
    
    const result = await generateContent(req);
    return result;
}

export default llama_run;