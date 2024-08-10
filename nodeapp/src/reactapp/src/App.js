import logo from './logo.svg';
import './App.css';
import MainPage from './public/JSX/MainPage/MainPage';
import ChatListPage from './public/JSX/ChatListPage/ChatListPage';
import ChatPage from './public/JSX/ChatPage/ChatPage';
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/chatListPage" element={<ChatListPage/>} />
          <Route path="/chatPage/:room" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

