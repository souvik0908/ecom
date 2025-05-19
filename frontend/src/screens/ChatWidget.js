import React, { useState } from 'react';
import ChatLogo from './ChatLogo'; // Your animated logo component
import ChatBot from './ChatBotScreen';   // Your chatbot screen component

function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  return (
    <div>
      <ChatLogo onClick={toggleChat} />
      {isChatOpen && <ChatBot />}
    </div>
  );
}

export default ChatWidget;
