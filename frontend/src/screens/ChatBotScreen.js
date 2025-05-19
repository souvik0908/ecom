import React, { useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

function ChatBotScreen() {
  useEffect(() => {
    // Initial welcome message
    addResponseMessage('Welcome to our shopping assistant! Ask me anything about our products, prices, or recommendations.');
  }, []);

  const handleNewUserMessage = async (message) => {
    console.log("User message:", message);

    try {
      // Retrieve userInfo object from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo")); 
      console.log("User Info:", userInfo);

      if (!userInfo || !userInfo.access || !userInfo.token) {
        throw new Error("You must be logged in to use the support assistant.");
      }

      const token = userInfo.access; // Now getting the access token from the userInfo object
      console.log("Token:", token);

      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include JWT token
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.message?.content || "Sorry, I didn't understand that.";
      addResponseMessage(reply);

    } catch (error) {
      console.error("Chat Error:", error);
      addResponseMessage(error.message || "There was an error reaching the assistant.");
    }
  };

  return (
    <div className="ChatBotScreen">
      <Widget handleNewUserMessage={handleNewUserMessage} />
    </div>
  );
}

export default ChatBotScreen;
