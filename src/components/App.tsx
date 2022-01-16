import { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { io } from 'socket.io-client';

import '../css/App.css';

import { CHAT_SERVER_URL } from '../env';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [nightmode, setNightMode] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);

  // setup socket.io server
  const connectChatServer = () => {
    const socket = io('ws://localhost:4040'); // establish web socket connection

    return socket;
  };

  useEffect(() => {
    const socket = connectChatServer();
    socket.onAny((message) => {
      // render message on dom on when recieving socket messages
      // state here is not flushed so updated scroll here will not sync up with
      // incoming new messages - it will scroll to the second last message
      // instead of the last
      // flushSync (imported from react-dom) helps make sure stuff written below
      // will happen after dom update resulting from this state update
      // flushSync(() => {
      setMessages((m) => [...m, message]);
      // })
      // scrolls to latest message to keep latest chat in view
      scrollToLatestMsg();
    });
  }, []);

  const scrollToLatestMsg = (): void => {
    const lastChild = listRef.current!.lastElementChild;
    lastChild?.scrollIntoView({ behavior: 'smooth' }); // scrolls last chat into view
  };

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
      <div className="chat-area" ref={listRef}>
        <div className="chat-title">Chat Area</div>
        {messages?.map((msg) => (
          <div className="msg-item">{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
