import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
import { io } from 'socket.io-client';

import '../css/App.css';

import { CHAT_SERVER_URL } from '../env';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>();

  // setup socket.io server
  const connectChatServer = () => {
    const socket = io('ws://localhost:4040'); // establish web socket connection

    return socket;
  };

  useEffect(() => {
    const socket = connectChatServer();
    socket.onAny((message) => {
      console.log('Message:', message);
      if (messages) {
        setMessages([...messages, message]);
      }
    });
  }, []);

  return (
    <div>
      <h3>LiveChat App</h3>
      <div className="chat-area">
        {messages?.map((msg) => (
          <div className="msg-item">{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
