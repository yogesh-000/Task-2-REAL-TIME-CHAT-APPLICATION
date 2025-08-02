import React, { useEffect, useState, useRef } from "react";

const WS_URL = "ws://localhost:4000";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        setMessages(data.messages);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const message = { text: input, timestamp: Date.now() };
    ws.current.send(JSON.stringify(message));
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Real-Time Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: 400,
          overflowY: "scroll",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <span>{new Date(msg.timestamp).toLocaleTimeString()} - </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 8 }}>
        Send
      </button>
    </div>
  );
}

export default App;
