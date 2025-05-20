// src/pages/Chat/Chat.tsx
import { useEffect, useState } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatRoom from '../../components/Chat/ChatRoom';
import { dummyUsers, dummyMessages } from '../../data/Chat/dummyChats';
import type { Message } from '../../types/chat';
import '../../styles/ChatRoomWrapper.css';

export default function Chat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);

  // resize 이벤트 리스너로 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setMessageList(dummyMessages[id]);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: 'me',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessageList((prev) => [...prev, newMsg]);
    setMessage('');
  };

  // 📱 모바일: ChatList → ChatRoom 전환
  if (isMobile) {
    if (selectedId === null) {
      return (
        <ChatList
          users={dummyUsers}
          onSelect={handleSelect}
          selectedId={null}
        />
      );
    }

    return (
      <ChatRoom
        selectedId={selectedId}
        message={message}
        messageList={messageList}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    );
  }

  // 🖥️ 데스크탑: ChatList + ChatRoom 동시 표시
  return (
    <div className="chat-wrapper">
      <div className="chat-list-panel">
        <ChatList
          users={dummyUsers}
          onSelect={handleSelect}
          selectedId={selectedId}
        />
      </div>
      <div className="chat-room-panel">
        {selectedId !== null ? (
          <ChatRoom
            selectedId={selectedId}
            message={message}
            messageList={messageList}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        ) : (
          <div style={{ padding: "2rem", color: "#888" }}>
            채팅을 시작할 대화를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
