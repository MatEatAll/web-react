import { useState, useRef } from "react";
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
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    scrollTop.current = wrapperRef.current?.scrollTop ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !wrapperRef.current) return;
    const diffY = e.clientY - startY.current;
    wrapperRef.current.scrollTop = scrollTop.current - diffY;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const filteredUsers = showUnreadOnly
    ? users.filter((user) => (user.unreadCount ?? 0) > 0)
    : users;

  return (
    <div
      className="chat-list-wrapper"
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="chat-list-header"
        onClick={() => setShowUnreadOnly((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <div className="header-toggle">
          <span>안읽은 메시지만 보기</span>
          <span className="check-icon">
            <svg
              fill="none"
              strokeWidth="1.5"
              stroke={showUnreadOnly ? "#f97316" : "currentColor"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </span>
        </div>
      </div>

      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className={`chat-list-item ${selectedId === user.id ? "selected" : ""}`}
          onClick={() => onSelect(user.id)}
        >
          <div className="chat-list-row">
            <span className="chat-list-name">{user.name}</span>
            <span className="chat-list-date">{user.lastDate}</span>
          </div>
          <div className="chat-list-message-row">
            <div className="chat-list-message">{user.lastMessage}</div>
            {typeof user.unreadCount === "number" && user.unreadCount > 0 && (
              <div className="unread-badge">{user.unreadCount}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
