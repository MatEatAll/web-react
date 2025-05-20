export interface ChatUser {
  id: number;
  name: string;
  lastMessage: string;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}


export const dummyMessages: Record<number, Message[]> = {
  1: [
    { id: 1, sender: 'Alice', content: 'Hi!', timestamp: '10:00' },
    { id: 2, sender: 'me', content: 'Hello!', timestamp: '10:01' },
  ],
  2: [
    { id: 1, sender: 'Bob', content: 'Let’s catch up later.', timestamp: '11:00' },
    { id: 2, sender: 'me', content: 'Sure!', timestamp: '11:01' },
  ],
};

export const dummyUsers = [
  {
    id: 1,
    name: "userID",
    lastMessage: "문의내용",
    lastDate: "2시간 전",
    unreadCount: 0,
  },
  {
    id: 2,
    name: "userID",
    lastMessage: "아 네 감사합니다!",
    lastDate: "2시간 전",
    unreadCount: 0,
  },
  {
    id: 3,
    name: "userID",
    lastMessage: "문의내용",
    lastDate: "4월 27일",
    unreadCount: 2,
  },
];

