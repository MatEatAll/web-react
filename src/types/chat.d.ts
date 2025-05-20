export interface User {
  name: string;
}

export interface ChatMessage {
  _id: number;
  chat: string;
  user: User;
}
export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}
