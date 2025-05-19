import React from 'react';
import Lottie from 'lottie-react';
import chatbotAnimation from './chatbotAnimation.json'; // Replace with your animation file path

const ChatLogo = ({ onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', width: 100, height: 100 }}>
      <Lottie animationData={chatbotAnimation} loop={true} />
    </div>
  );
};

export default ChatLogo;
