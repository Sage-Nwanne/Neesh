import { useState } from 'react';
import styles from './AdminChatbot.module.css';

const AdminChatbot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your admin assistant. I can help you with submissions, orders, moderation, and analytics. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const botResponse = generateBotResponse(inputValue);
    const botMessage = {
      id: messages.length + 2,
      type: 'bot',
      content: botResponse,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage, botMessage]);
    setInputValue('');
  };

  const generateBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('submission') || lowerInput.includes('pending')) {
      return 'I can see you have 3 pending submissions: "Urban Photography Quarterly", "Sustainable Living Guide", and "Indie Music Scene". Would you like me to provide details about any specific submission?';
    }
    
    if (lowerInput.includes('order') || lowerInput.includes('shipping')) {
      return 'Currently tracking 3 orders: 1 pending, 1 processing, and 1 shipped. Order #ord_admin_003 needs tracking number TRK987654321 updated. Would you like me to show order details?';
    }
    
    if (lowerInput.includes('flagged') || lowerInput.includes('moderation')) {
      return 'There are 3 flagged items requiring attention: 2 high priority and 1 medium priority. "Controversial Topics Weekly" needs immediate review. Should I prioritize this for you?';
    }
    
    if (lowerInput.includes('revenue') || lowerInput.includes('sales') || lowerInput.includes('analytics')) {
      return 'This month\'s revenue is $12,847.50 with 15.3% growth. Top performer is "Modern Living Magazine". Would you like a detailed breakdown or specific metrics?';
    }
    
    if (lowerInput.includes('approve') && lowerInput.includes('all')) {
      return 'I can help approve submissions, but I recommend reviewing each individually for quality control. Would you like me to show you the approval criteria checklist?';
    }
    
    if (lowerInput.includes('publisher') || lowerInput.includes('retailer')) {
      return 'We have 12 active publishers and 8 verified retailers. 3 new publisher applications are pending review. Need help with partner management?';
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return 'I can help you with:\n• Review and approve submissions\n• Track and manage orders\n• Handle content moderation\n• Provide analytics insights\n• Manage publisher/retailer accounts\n• Generate reports\n\nWhat specific task would you like assistance with?';
    }
    
    if (lowerInput.includes('report') || lowerInput.includes('export')) {
      return 'I can generate reports for submissions, orders, revenue, and user activity. What type of report would you like? I can export data in CSV or PDF format.';
    }
    
    return 'I understand you\'re asking about admin tasks. I can help with submissions, orders, moderation, analytics, and user management. Could you be more specific about what you need assistance with?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {!isOpen ? (
        <button 
          className={styles.chatbotToggle}
          onClick={() => setIsOpen(true)}
        >
          💬 Admin Assistant
        </button>
      ) : (
        <div className={styles.chatbotWindow}>
          <div className={styles.chatbotHeader}>
            <h3>Admin Assistant</h3>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.message} ${styles[msg.type]}`}>
                <div className={styles.messageContent}>
                  {msg.content}
                </div>
                <div className={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about submissions, orders, moderation..."
              className={styles.messageInput}
            />
            <button 
              onClick={handleSendMessage}
              className={styles.sendButton}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatbot;
