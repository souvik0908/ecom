import React from 'react';
import Lottie from 'lottie-react';
import supportBotAnimation from './supportanimation.json'; // Replace with your support bot animation JSON

const SupportChatLogo = ({ onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', width: 100, height: 100 }}>
      <Lottie animationData={supportBotAnimation} loop autoplay />
    </div>
  );
};

export default SupportChatLogo;
