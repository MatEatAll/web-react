// src/components/Chat/ChatRoom.tsx
import type { FC } from 'react';
import MessageContainer from './MessageContainer';
import InputField from './InputField';
import type { Message } from '../../types/chat';
import '../../styles/ChatRoomWrapper.css';

interface ChatRoomProps {
  selectedId: number;
  message: string;
  messageList: Message[];                 // 상위에서 WS 파싱/병합한 리스트만 받음
  setMessage: (value: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void; // 상위에서 WS 발행+로컬반영
}

const ChatRoom: FC<ChatRoomProps> = ({
  message,
  messageList,
  setMessage,
  sendMessage,
}) => {
  return (
    <div className="chat-room-wrapper">
      <div className="message-scroll-area">
        <MessageContainer
          messageList={messageList.map((msg) => ({
            _id: typeof msg.id === 'number' ? msg.id : Number(msg.id),
            chat: msg.content,                 // ✅ 이미 상위에서 JSON.parse 해서 content만 전달됨
            user: { name: msg.sender },        // 'me' | 'other' 등
          }))}
          user={{ name: 'me' }}
        />
      </div>
      <div className="input-field-wrapper">
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}           // ✅ 상위 핸들러 그대로 사용
        />
      </div>
    </div>
  );
};

export default ChatRoom;
