"use client";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import TextField from "@mui/material/TextField";

// 메시지 타입 정의
interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

// 채팅방 타입
interface ChatRoomData {
  chatRoomId: number;
  participants: Participant[];
  messages: Message[];
}

// 참가자 타입
interface Participant {
  userId: string;
  username: string;
  photo: string;
  status: string;
}

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  // 소켓 ref
  //const socketRef = useRef<Socket | null>(null);

  /*
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/auth/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Fetch failed with status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched user data:", data);

        // 소켓 연결
        const socket = io("http://localhost:5000", { withCredentials: true });
        socketRef.current = socket;
        console.log("Socket initialized:", socketRef.current);

        // (1) 클라이언트 -> 서버: kakao-info 이벤트로 kakaoId 전송
        if (data.user.kakaoId) {
          console.log("Emitting kakao-info with ID:", data.user.kakaoId);
          socket.emit("kakao-info", data.user.kakaoId);
        }

        // (2) 서버 -> 클라이언트: init 이벤트로 유저 정보 받기
        socket.on("init", (userFromDB: User) => {
          console.log("Received user info via init:", userFromDB);
          // userFromDB = {_id, kakaoId, username, ...} 형태
          setCurrentUser(userFromDB);
        });

        // (3) 서버 -> 클라이언트: receive message 이벤트로 메시지 받기
        socket.on("receive message", (msg: Message) => {
          setMessages((prev) => [...prev, msg]);
        });

        // 기존 메시지 가져오기
        const messagesRes = await fetch(
          "http://localhost:4000/chatother/messages",
          {
            credentials: "include",
          }
        );
        if (!messagesRes.ok) {
          throw new Error(`Failed to fetch messages: ${messagesRes.status}`);
        }
        const existingMessages = await messagesRes.json();
        console.log("Fetched messages:", existingMessages);

        // 기존 메시지 상태 업데이트
        setMessages(existingMessages);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);*/

  // IME 관련
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInput(event.target.value);

  // 메시지 전송 함수
  /*
  const sendMessage = async (messageContent: string) => {
    console.log("socketRef.current:", socketRef.current);
    console.log("currentUser:", currentUser);

    if (socketRef.current && currentUser) {
      const messageData: Message = {
        messageId: `msg_${Date.now()}`,
        senderId: currentUser._id, // _id 사용
        senderKakaoId: currentUser.kakaoId,
        senderName: currentUser.username, // username 사용
        message: messageContent,
        time: new Date().toISOString(),
      };
      console.log("Sending message:", messageData);

      // *** 여기 중요! 백엔드에서 'send message' 로 듣고 있으므로 이벤트명 통일 ***
      socketRef.current.emit("send message", messageData);
      // 2. 백엔드 API를 통해 DB에 메시지 저장
      try {
        const response = await fetch(
          "http://localhost:4000/chatother/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: currentUser._id,
              message: messageContent,
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
    } else {
      console.warn("socketRef.current or currentUser is not initialized");
    }
  };*/

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetch("/dummy/messages_data.json");
        if (!response.ok) {
          throw new Error(`Failed to load chat data: ${response.status}`);
        }

        const data: ChatRoomData = await response.json();
        setChatRoomId(data.chatRoomId);
        setParticipants(data.participants);
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData();
  }, []);

  const sendMessage = (messageContent: string) => {
    if (!messageContent.trim()) return;

    const newMessage: Message = {
      messageId: `msg_${Date.now()}`,
      senderId: "myId",
      senderName: "나",
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log("Message sent to server:", newMessage);
  };

  // Enter 키 입력 시 메시지 전송
  /*
  const handleSendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", event.key);

    if (isComposing) return;
    if (event.key === "Enter" && input.trim()) {
      event.preventDefault();
      console.log("Calling sendMessage with:", input);
      sendMessage(input);
      setInput("");
    }
  };*/
  const handleSendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return; // IME 상태 확인
    if (event.key === "Enter" && input.trim()) {
      event.preventDefault(); // 기본 Enter 동작 방지

      // 메시지 전송 호출
      sendMessage(input);

      // 입력 필드 초기화
      setInput("");
    }
  };

  return (
    <ChatContainer>
      <ChatAreaContainer>
        {/* 메시지 렌더링 */}
        {messages.map((msg) => {
          const isCurrentUser =
            currentUser && msg.senderId === currentUser.userId;

          return (
            <MessageContainer
              key={msg.messageId}
              role={isCurrentUser ? "user" : "other"}
            >
              {/* 상대방 메시지일 경우 아이콘 표시 */}
              {!isCurrentUser && (
                <OtherIcon>
                  <Image
                    src={
                      participants.find(
                        (participant) => participant.userId === msg.senderId
                      )?.photo || "/default-photo.png" // 기본 이미지 경로
                    }
                    alt="person"
                    width={30}
                    height={30}
                  />
                </OtherIcon>
              )}

              <div
                style={{ flexDirection: "column", gap: "2px", display: "flex" }}
              >
                {/* 상대방 메시지일 경우 이름 표시 */}
                {!isCurrentUser && (
                  <NameText>{msg.senderName || msg.senderId}</NameText>
                )}

                <div
                  style={{ flexDirection: "row", gap: "5px", display: "flex" }}
                >
                  {isCurrentUser ? (
                    <>
                      <TimeText>
                        {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TimeText>
                      <TextContainer role="user">{msg.content}</TextContainer>
                    </>
                  ) : (
                    <>
                      <TextContainer role="other">{msg.content}</TextContainer>
                      <TimeText>
                        {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TimeText>
                    </>
                  )}
                </div>
              </div>
            </MessageContainer>
          );
        })}
      </ChatAreaContainer>
      {/* 입력 영역 */}
      <InputArea>
        <div style={{ width: "80%", display: "flex", background: "#d9d9d9" }}>
          <StyledTextField
            id="standard-search"
            type="search"
            variant="standard"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleSendMessage}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="대화를 나눠보세요..."
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
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 5px;
  background-color: #d9d9d9 !important; /* 배경색 */

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
