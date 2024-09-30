import { app } from './app.js';

const PORT = 5000;

// 서버 생성 및 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

