import { useEffect, useMemo, useRef, useState } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatRoom from '../../components/Chat/ChatRoom';
import { dummyUsers, dummyMessages } from '../../data/Chat/dummyChats';
import type { Message } from '../../types/chat';
import '../../styles/ChatRoomWrapper.css';
import { useStomp } from '../../ws/StompProvider';

export default function Chat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);

  const { status, subscribe, send } = useStomp();

  // 👇 이미 처리한 메시지 서명 캐시(중복 방지)
  const seen = useRef<Set<string>>(new Set());
  const sign = (sender: string, content: string, createdAt: string) =>
    `${sender}|${content}|${createdAt}`;

  // 반응형
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 방 선택
  const handleSelect = (id: number) => {
    setSelectedId(id);
    setMessageList(dummyMessages[id] ?? []);
    seen.current.clear(); // 방 바뀔 때 캐시 초기화
  };

  //Chat.tsx에 내 senderId 결정 로직
  function getMySenderId() {
  // 1) ?u=alice 같은 쿼리 파라미터가 있으면 우선
  const u = new URLSearchParams(window.location.search).get('u');
  if (u) {
    localStorage.setItem('dev.senderId', u);
    return u;
  }
  // 2) 로컬스토리지 저장값
  const s = localStorage.getItem('dev.senderId');
  if (s) return s;
  // 3) 기본값
  return 'me';
}
const mySenderId = getMySenderId();

  // ====== 구독: topic 1개만 ======
  useEffect(() => {
    if (status !== 'connected' || selectedId == null) return;

    const topic = `/topic/rooms.${selectedId}`;

    const parseIncoming = (raw: string) => {
      try {
        const p = JSON.parse(raw);
        return {
          content: typeof p?.content === 'string' ? p.content : raw,
          sender: typeof p?.senderId === 'string' ? p.senderId : 'other',
          createdAt:
            typeof p?.createdAt === 'string'
              ? p.createdAt
              : new Date().toISOString(),
        };
      } catch {
        return { content: raw, sender: 'other', createdAt: new Date().toISOString() };
      }
    };

    const un = subscribe(topic, (msg) => {
      const { content, sender, createdAt } = parseIncoming(msg.body);

      // (A) 내가 보낸 에코는 무시
      if (sender === mySenderId) return;

      // (B) 서명 기반 dedup
      const k = sign(sender, content, createdAt);
      if (seen.current.has(k)) return;
      seen.current.add(k);

      setMessageList((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender, // 보통 'other'
          content,
          timestamp: new Date(createdAt).toLocaleTimeString(),
        },
      ]);
    });

    return () => un();
  }, [status, selectedId, subscribe]);

  // ====== 보내기: 발행 + 로컬 반영 + dedup 캐시에 미리 등록 ======
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || selectedId == null) return;

    const createdAt = new Date().toISOString();

    // 1) 서버로 발행
    send(`/app/rooms.${selectedId}.send`, {
      roomId: String(selectedId),
      senderId: mySenderId,
      content: trimmed,
      createdAt,
    });

    // 2) 로컬 즉시 반영
    const newMsg: Message = {
      id: Date.now(),
      sender: 'me',
      content: trimmed,
      timestamp: new Date(createdAt).toLocaleTimeString(),
    };
    setMessageList((prev) => [...prev, newMsg]);

    // 3) 에코가 와도 무시되도록 미리 서명 등록
    seen.current.add(sign(mySenderId, trimmed, createdAt));

    setMessage('');
  };

  const listUsers = useMemo(() => dummyUsers, []);

  if (isMobile) {
    if (selectedId === null) {
      return <ChatList users={listUsers} onSelect={handleSelect} selectedId={null} />;
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

  return (
    <div className="chat-wrapper">
      <div className="chat-list-panel">
        <ChatList users={listUsers} onSelect={handleSelect} selectedId={selectedId} />
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
          <div className="chat-placeholder">
            <p className="login-subtitle">경험의 맛을 잇다</p>
            <h1 className="login-title">맛잇다</h1>
          </div>
        )}
      </div>
    </div>
  );
}
