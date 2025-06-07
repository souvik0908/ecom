import React, { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import axios from "axios";

function ChatBotScreen() {
  useEffect(() => {
    addResponseMessage(
      "Welcome to our shopping assistant! Ask me anything about our products, prices, or recommendations."
    );
  }, []);

  const saveChat = async (message, isUser) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        console.warn("User not logged in — chat not saved.");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/chat/save/",
        {
          message,
          is_user: isUser,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleNewUserMessage = async (message) => {
    console.log("User message:", message);

    await saveChat(message, true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.access || !userInfo.token) {
        throw new Error("You must be logged in to use the support assistant.");
      }

      const token = userInfo.access;

      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
        }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const reply = data.message?.content || "Sorry, I didn't understand that.";

      addResponseMessage(reply);

      await saveChat(reply, false);
    } catch (error) {
      console.error("Chat Error:", error);
      addResponseMessage(
        error.message || "There was an error reaching the assistant."
      );
    }
  };

  return (
    <div className="ChatBotScreen">
      <Widget handleNewUserMessage={handleNewUserMessage} />
    </div>
  );
}

export default ChatBotScreen;
