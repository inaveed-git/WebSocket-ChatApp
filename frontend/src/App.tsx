import React, { useEffect, useState, useRef } from 'react';

const socket = new WebSocket("ws://localhost:8080");

const App = () => {
  const [chatInfo, setChatInfo] = useState("");
  const [roomid, setRoomid] = useState(() => localStorage.getItem("roomid") || "");
  const [joined, setJoined] = useState(() => localStorage.getItem("joined") === "true");
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.onmessage = (e) => {
      setMessages(prev => [...prev, e.data]);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = () => {
    if (!roomid.trim()) {
      console.log("You need to add the room ID");
      return;
    }

    socket.send(JSON.stringify({
      type: "join",
      payload: { roomid }
    }));

    localStorage.setItem("roomid", roomid);
    localStorage.setItem("joined", "true");
    setJoined(true);
  };

  const sendMsg = () => {
    if (!chatInfo.trim()) return;

    socket.send(JSON.stringify({
      type: "chat",
      payload: { message: chatInfo }
    }));

    setChatInfo("");
  };

  return (
    <div className="bg-gray-900 h-screen w-screen flex justify-center items-center text-white px-4">
      {!joined ? (
        <div className="space-y-6 w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-white">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomid}
            onChange={(e) => setRoomid(e.target.value)}
            className="w-full p-3 text-black border border-gray-400 rounded-lg"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white text-black p-6 rounded-xl shadow-lg flex flex-col h-[80vh]">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Room: {roomid}</h2>

          <div className="flex-1 overflow-y-auto space-y-2 border p-4 rounded bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md shadow-sm w-fit max-w-[80%]"
              >
                {msg}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInfo}
              onChange={(e) => setChatInfo(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMsg}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
