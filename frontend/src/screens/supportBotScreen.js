import React, { useEffect, useState } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

function SupportBotScreen() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [welcomeSent, setWelcomeSent] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/csrf-token/', {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to get CSRF token');

        const data = await response.json();
        setCsrfToken(data.csrfToken);

        if (!welcomeSent) {
          addResponseMessage("Hi there! I'm your support assistant. Ask me about your order status, delivery, payment issues, or anything else.");
          setWelcomeSent(true);
        }
      } catch (error) {
        console.error('CSRF Token Error:', error);
        addResponseMessage("Service unavailable. Please try later.");
      }
    };

    fetchCsrfToken();
  }, [welcomeSent]);

  const handleNewUserMessage = async (message) => {
    try {
      if (!csrfToken) throw new Error('Security token not loaded');

      const response = await fetch('http://localhost:8000/api/chat-support/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          messages: [{ role: "user", content: message }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.response || "Sorry, I didn’t understand that.";
      addResponseMessage(reply);
    } catch (error) {
      console.error("Chat Error:", error);
      addResponseMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div id="support-chat-widget">
      <Widget handleNewUserMessage={handleNewUserMessage} />
    </div>
  );
}

export default SupportBotScreen;
