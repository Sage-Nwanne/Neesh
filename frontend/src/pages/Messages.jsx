import { useState, useEffect } from 'react';
import styles from './Messages.module.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className={styles.messages}>
      <div className="container">
        <h1>Messages</h1>
        <div className={styles.messageContainer}>
          <div className={styles.messageList}>
            {/* Message list will go here */}
            <p>No messages yet</p>
          </div>
          <div className={styles.messageInput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;