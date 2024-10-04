import './App.css';
import MainPage from './public/JSX/MainPage/MainPage';
import ChatPage from './public/JSX/ChatPage/ChatPage';
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/chatPage" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

