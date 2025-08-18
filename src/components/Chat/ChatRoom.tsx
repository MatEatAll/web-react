// src/components/Chat/ChatRoom.tsx
import React, { type FC, useEffect, useMemo, useRef, useState } from 'react';
import MessageContainer from './MessageContainer';
import InputField from './InputField';
import type { Message } from '../../types/chat';
import '../../styles/ChatRoomWrapper.css';
import { useStomp } from '../../ws/StompProvider';

interface ChatRoomProps {
  /** 선택된 방 id (토픽/큐 경로로 사용) */
  selectedId: number;
  /** 입력창 제어 */
  message: string;
  setMessage: (value: string) => void;
  /** 기존에 쓰던 전송 핸들러(폼 onSubmit) */
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  /** 기존에 렌더링하던 메시지 리스트 */
  messageList: Message[];
}

/** MessageContainer가 기대하는 형태에 맞춤: _id는 number */
type ChatMessage = {
  _id: number;
  chat: string;
  user: { name: string };
};

const ChatRoom: FC<ChatRoomProps> = ({
  selectedId,
  message,
  messageList,
  setMessage,
  sendMessage,
}) => {
  const { status, subscribe, send } = useStomp();

  /** WS로 수신한 메시지를 로컬에 쌓음 (기존 props 메시지와 병합 렌더링) */
  const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]);

  /** number id 생성기 (Date.now() + 증가값) */
  const idSeq = useRef(0);
  const mkIdNum = () => {
    idSeq.current += 1;
    return Number(Date.now() + idSeq.current);
  };

  /** 구독 해제 함수 보관 */
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (status !== 'connected') return;

    const topic = `/topic/rooms.${selectedId}`;
    const userQueue = `/user/queue/rooms.${selectedId}`;

    const un1 = subscribe(topic, (msg) => {
      setWsMessages((prev) => [
        ...prev,
        { _id: mkIdNum(), chat: msg.body, user: { name: 'room' } },
      ]);
    });

    const un2 = subscribe(userQueue, (msg) => {
      setWsMessages((prev) => [
        ...prev,
        { _id: mkIdNum(), chat: msg.body, user: { name: 'me' } },
      ]);
    });

    unsubRef.current = () => {
      un1();
      un2();
    };
    return () => unsubRef.current?.();
  }, [status, selectedId, subscribe]);

  /** InputField의 onSubmit: STOMP 발행 → 기존 전송 핸들러 호출 */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    // 서버 규약 가정: /app/rooms.{roomId}.send 로 발행
    const payload = {
      roomId: String(selectedId),
      senderId: 'me', // 실제 사용자 id로 교체 가능
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    send(`/app/rooms.${selectedId}.send`, payload);

    // 기존 앱 로직 유지 (입력 초기화/리스트 반영 등)
    sendMessage(e);
  };

  /** props 메시지를 MessageContainer 포맷(ChatMessage)으로 변환 */
  const mappedFromProps = useMemo<ChatMessage[]>(
    () =>
      messageList.map((msg) => ({
        _id: typeof msg.id === 'number' ? msg.id : Number(msg.id), // number 강제
        chat: msg.content,
        user: { name: msg.sender },
      })),
    [messageList]
  );

  /** 최종 렌더링 리스트: 기존 + WS 수신 합치기 (모두 ChatMessage[]) */
  const renderList = useMemo<ChatMessage[]>(
    () => [...mappedFromProps, ...wsMessages],
    [mappedFromProps, wsMessages]
  );

  return (
    <div className="chat-room-wrapper">
      <div className="message-scroll-area">
        <MessageContainer messageList={renderList} user={{ name: 'me' }} />
      </div>
      <div className="input-field-wrapper">
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={handleSubmit} // WS 발행 + 기존 전송 호출
        />
      </div>
    </div>
  );
};

export default ChatRoom;
