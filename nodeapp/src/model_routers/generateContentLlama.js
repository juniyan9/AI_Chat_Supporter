function generateContent(req){
    return fetch('http://43.203.141.146:11434/api/chat', {
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
    .then(data => {
        console.log('Response data:', data);
        return data.message.content
    });
}

export const llama_run = async (req) => {
    
    const result = await generateContent(req);
    return result;
}

export default llama_run;