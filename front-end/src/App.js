import './App.css';
import { Route, Routes } from 'react-router-dom'; // Now Routes is available in v6
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';


function App() {
  return (
    <div className="App">
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;