import React, { useState } from 'react';
import SupportChatLogo from './supportChatlogo';  
import SupportBotScreen from './supportBotScreen';

function SupportChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div>
      <SupportChatLogo onClick={toggleChat} />
      {isChatOpen && <SupportBotScreen />}
    </div>
  );
}

export default SupportChatWidget;
