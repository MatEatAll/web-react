import type { FC } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./InputField.css";

interface InputFieldProps {
  message: string;
  setMessage: (value: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

const InputField: FC<InputFieldProps> = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="input-area">
      <div className="plus-button">+</div>
      <form onSubmit={sendMessage} className="input-container">
        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type in here…"
          size="small"
        />
        <Button
          disabled={message.trim() === ""}
          type="submit"
          className="send-button"
          variant="contained"
          sx={{
            backgroundColor: "#F7E600",
            color: "#000",
            borderRadius: 0,
            minWidth: "70px",
          }}
        >
          전송
        </Button>
      </form>
    </div>
  );
};

export default InputField;
