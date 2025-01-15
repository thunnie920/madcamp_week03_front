"use client";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/router"; // Next.js Router 가져오기
import { usePathname } from "next/navigation"; // Next.js navigation 훅

import Image from "next/image";
import TextField from "@mui/material/TextField";

interface Message {
  chatroomId: string;
  messageId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface Participant {
  userId: string;
  username: string;
  photo: string;
}

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const pathname = usePathname(); // 현재 경로 가져오기
  const currentChatRoomId = pathname.split("/").pop(); // 경로에서 chatRoomId 추출

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/userprofile", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        console.log("Fetched user data:", data);

        setCurrentUser({
          userId: data.userId,
          username: data.username,
          photo: data.photo,
        });

        const socket = io("http://localhost:5000", { withCredentials: true });
        socketRef.current = socket;

        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("disconnect", (reason) =>
          console.log("Socket disconnected:", reason)
        );

        socket.on("receive message", (msg: Message) => {
          setMessages((prev) => [...prev, msg]);
          console.log("New message received:", msg);
        });

        return () => socket.disconnect();
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("Updated current user data:", currentUser);
  }, [currentUser]);

  // 메시지 전송 함수
  const handleSendMessage = async () => {
    if (!input.trim() || !currentUser || !socketRef.current) return;
    if (!currentChatRoomId) {
      console.warn("No chatroom ID found");
      return; // chatRoomId가 없는 상황이면 전송 로직 중단
    }

    if (socketRef.current && currentUser) {
      const message: Message = {
        chatroomId: currentChatRoomId,
        messageId: `msg_${Date.now()}`,
        senderId: currentUser.userId,
        senderName: currentUser.username,
        content: input,
        timestamp: new Date().toISOString(),
      };

      console.log("Message:", message);
      socketRef.current.emit("sendMessage", message);

      // 2. 백엔드 API를 통해 DB에 메시지 저장
      try {
        const response = await fetch(
          `http://localhost:5000/chatother/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: currentUser.userId,
              message: input,
              chatroomId: currentChatRoomId, // string
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to save message: ${response.status}`);
        }

        const savedMessage = await response.json();
        console.log("Message saved to DB:", savedMessage);
      } catch (error) {
        console.error("Failed to save message to DB:", error);
      }
      setMessages((prev) => [...prev, message]);
      setInput("");

      console.log("Message sent:", message);
    } else {
      console.warn("socketRef.current or currentUser is not initialized");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return; // IME 조합 중에는 아무 작업도 하지 않음
    if (e.key === "Enter" && !e.shiftKey) {
      // 엔터키 단독으로 눌렀을 때만 전송
      e.preventDefault(); // 기본 엔터키 동작 방지
      handleSendMessage(); // 메시지 전송
    }
  };

  return (
    <ChatContainer>
      <ChatAreaContainer>
        {messages.map((msg) => {
          const isCurrentUser = currentUser?.userId === msg.senderId;

          console.log(
            "Rendering message:",
            msg,
            "isCurrentUser:",
            isCurrentUser
          );

          return (
            <MessageContainer
              key={msg.messageId}
              role={isCurrentUser ? "user" : "other"}
            >
              {!isCurrentUser && (
                <OtherIcon>
                  <Image
                    src={
                      participants.find((p) => p.userId === msg.senderId)
                        ?.photo || "/default-photo.png"
                    }
                    alt="User"
                    width={30}
                    height={30}
                  />
                </OtherIcon>
              )}
              <TextContainer role={isCurrentUser ? "user" : "other"}>
                {msg.content}
              </TextContainer>
              <TimeText>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </TimeText>
            </MessageContainer>
          );
        })}
      </ChatAreaContainer>
      <InputArea>
        <div style={{ width: "80%", display: "flex", background: "#d9d9d9" }}>
          <StyledTextField
            id="standard-search"
            type="search"
            variant="standard"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a message..."
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </div>
      </InputArea>
    </ChatContainer>
  );
}

// === 스타일 코드 (원본 동일) ===
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 7px;
  height: 100%;
  border: 1px solid blue;
  border-radius: 5px;
  background-color: #f5f5f5;
  padding: 7px;
`;

const InputArea = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  color: #302d2d;
  background-color: #d9d9d9;
  border: 1px solid blue;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 5px;
  border: 1px solid red;

  .MuiInputBase-root {
    background-color: #d9d9d9; /* 입력 영역의 배경색 */
  }

  .MuiInput-underline:before {
    border-bottom: 2px solid transparent; /* 기본 밑줄 제거 */
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid #353131; /* 활성 밑줄 색 변경 */
  }
`;

const NameText = styled.div`
  dispaly: flex;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 12px;
  font-weight: 400;
`;

const TimeText = styled.div`
  dispaly: flex;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 10px;
  font-weight: 200;
  margin-top: auto;
`;

const TextContainer = styled.div<{ role: string }>`
  display: inline-block;
  max-width: 400px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ role }) => (role === "user" ? "#f8d7da" : "#d9d9d9")};
  color: #302d2d;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 12px;
  font-weight: 400;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
`;

const MessageContainer = styled.div<{ role: string }>`
  display: flex;
  flex-direction: ${({ role }) => (role === "user" ? "row-reverse" : "row")};
  gap: 7px;
  max-width: 100%;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 100%;
`;

const ChatAreaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
  width: 100%;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  max-height: calc(100% - 50px);
  overflow-y: auto;
  border: 1px solid red;

  &::-webkit-scrollbar {
    width: 0px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

const OtherIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: transparent;
  border-radius: 5px;
  margin-bottom: 10px;
`;
