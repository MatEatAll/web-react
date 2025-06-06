import type { FC } from "react";
import { Container } from "@mui/system";
import "./MessageContainer.css";
import type { ChatMessage, User } from "../../types/chat";

interface MessageContainerProps {
    messageList: ChatMessage[];
    user: User;
}

const MessageContainer: FC<MessageContainerProps> = ({ messageList, user }) => {
    return (
        <>
            {messageList.map((message, index) => (
                <Container key={message._id} className="message-container">
                    {message.user.name === "system" ? (
                        <div className="system-message-container">
                            <p className="system-message">{message.chat}</p>
                        </div>
                    ) : message.user.name === user.name ? (
                        <div className="my-message-container">
                            <div className="my-message">{message.chat}</div>
                        </div>
                    ) : (
                        <div className="your-message-container">

                            {/* 
                                <img
                                src="/profile.jpeg"
                                alt="profile"
                                className="profile-image"
                                style={
                                    index === 0 ||
                                    messageList[index - 1].user.name === user.name ||
                                    messageList[index - 1].user.name === "system"
                                    ? { visibility: "visible" }
                                    : { visibility: "hidden" }
                                }
                                /> 
                            */}
                            <div className="your-message">{message.chat}</div>
                        </div>
                    )}
                </Container>
            ))}
        </>
    );
};

export default MessageContainer;
