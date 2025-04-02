import { useState } from "react";
import axios from "axios";
import "./chatpage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I *not* help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    try {
      // Fetch joke from API
      const response = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });

      // Add API response to messages
      setMessages((prev) => [
        ...prev,
        { text: response.data.joke, sender: "bot" }
      ]);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! I'm too lazy to fetch a joke 😴", sender: "bot" }
      ]);
    }

    setInput(""); // Clear input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <h1 className="text-4xl font-bold text-yellow-400">World's Worst Chatbot</h1>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "bot" ? "bot-message" : "user-message"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
