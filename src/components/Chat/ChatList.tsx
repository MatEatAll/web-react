import type { FC } from "react";
import "./ChatList.css";

interface User {
  id: number;
  name: string;
  lastMessage: string;
  lastDate: string;
  unreadCount?: number;
}

interface ChatListProps {
  users: User[];
  onSelect: (id: number) => void;
  selectedId?: number | null;
}

const ChatList: FC<ChatListProps> = ({ users, onSelect, selectedId }) => {
  return (
    <div className="chat-list-wrapper">
      <div className="chat-list-header">
        <span>안읽은 메시지만 보기</span>
        <span className="check">✔️</span>
      </div>
      {users.map((user) => (
        <div
          key={user.id}
          className={`chat-list-item ${
            selectedId === user.id ? "selected" : ""
          }`}
          onClick={() => onSelect(user.id)}
        >
          <div className="chat-list-row">
            <span className="chat-list-name">{user.name}</span>
            <span className="chat-list-date">{user.lastDate}</span>
          </div>
          <div className="chat-list-message">{user.lastMessage}</div>
          {user.unreadCount && user.unreadCount > 0 && (
            <div className="unread-badge">{user.unreadCount}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
