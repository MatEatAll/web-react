// src/components/Chat/ChatRoom.tsx
import type { FC } from 'react';
import MessageContainer from './MessageContainer';
import InputField from './InputField';
import type { Message } from '../../types/chat';
import '../../styles/ChatRoomWrapper.css';

interface ChatRoomProps {
  selectedId: number;
  message: string;
  messageList: Message[];
  setMessage: (value: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChatRoom: FC<ChatRoomProps> = ({
  message,
  messageList,
  setMessage,
  sendMessage,
}) => {
  return (
    <div className="chat-room-panel">
      <div className="message-scroll-area">
        <MessageContainer
          messageList={messageList.map((msg) => ({
            _id: msg.id,
            chat: msg.content,
            user: { name: msg.sender },
          }))}
          user={{ name: 'me' }}
        />
      </div>
      <InputField
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatRoom;
