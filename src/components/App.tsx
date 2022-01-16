import { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
import { io } from 'socket.io-client';

import '../css/App.css';

import { CHAT_SERVER_URL } from '../env';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [nightmode, setNightMode] = useState<boolean>(false);
  const msgRef = useRef<HTMLDivElement>();

  // setup socket.io server
  const connectChatServer = () => {
    const socket = io('ws://localhost:4040'); // establish web socket connection

    return socket;
  };

  useEffect(() => {
    const socket = connectChatServer();
    socket.onAny((message) => {
      // render message on dom on when recieving socket messages
      setMessages((m) => [...m, message]);
    });
  }, []);

  return (
    <div className={nightmode ? 'app nightmode' : 'app daymode'}>
      <h3>LiveChat App</h3>
      <div className="options">
        <div className="options-title">Settings:</div>
        <div className="options-item">
          <label htmlFor="nightmode">Night Mode</label>
          <input
            type="checkbox"
            name="nightmode"
            checked={nightmode}
            onChange={(e) => setNightMode((nightmode) => !nightmode)}
          />
        </div>
      </div>
      <hr />
      <div className="chat-area">
        <div className="chat-title">Chat Area</div>
        {messages?.map((msg) => (
          <div className="msg-item">{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
