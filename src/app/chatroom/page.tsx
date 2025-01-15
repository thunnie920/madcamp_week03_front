"use client";

import "@/src/styles/globals.css";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import ChatRoomCard from "@/src/components/ChatRoomCardComponent";
import { ObjectId } from "bson";

// ✅ chatRoomData 타입 정의
interface ChatRoomProps {
  userId: String;
  chatRoomArray: {
    username: string;
    id: string;
    status: string;
    photo: string;
    lastchatdate: number;
  }[];
}

export default function ChatRoom() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ChatRoomProps[]>([]);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [userId, setUserId] = useState<ObjectId | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (1) 로그인된 사용자 ID 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoading(true); // 요청 시작 시 로딩 상태 설정
      setError(null); // 에러 상태 초기화

      try {
        console.log("✅ Fetching chat rooms...");
        //const token = localStorage.getItem("authToken");
        const response = await fetch(
          "http://localhost:5000/api/chatrooms/user",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.log(`Status: ${response.status}`);
          const errorData = await response.text();
          console.error("Response error:", errorData);
          throw new Error("참여 중인 채팅방이 없습니다.");
        }

        const data: ChatRoomProps[] = await response.json();
        console.log("Fetched data:", data);
        setChatRooms(data);
        if (data.length === 0) {
          setError("참여 중인 채팅방이 없습니다."); // 빈 데이터 처리
        } else {
          setChatRooms(data); // 데이터가 있는 경우 상태 업데이트
        }
      } catch (error: any) {
        setError(error.message || "서버와의 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 요청 완료 후 로딩 상태 해제
      }
    };
    fetchChatRooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로딩 메시지 표시
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error}
      </div>
    ); // 에러 메시지 표시
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const handleCardClick = (id: string) => {
    router.push(`/chat/${id}`); // Navigate to a specific chat room
  };

  if (!chatRooms.length) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="채팅방에서 사랑을 시작해보세요." />
        <MainContent>
          <SideBar title="님의 채팅방" highlight="잠자는 호랑이" />
          {/*여기서 hightlight 부분에 현재 로그인한 유저 아이디 넣어야 함 */}
          <ProfileContainer>
            {chatRooms.map((room) =>
              room.chatRoomArray.map((profile) => (
                <CardWrapper
                  key={profile.id}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <ChatRoomCard
                    username={profile.username}
                    photo={profile.photo}
                    id={profile.id}
                    status={profile.status}
                    lastchatdate={profile.lastchatdate}
                    onClick={() => handleCardClick(profile.id)}
                  />
                  {hoverPosition && (
                    <HoverText
                      style={{
                        top: hoverPosition.y + 10,
                        left: hoverPosition.x + 10,
                      }}
                    >
                      채팅 시작하기
                    </HoverText>
                  )}
                </CardWrapper>
              ))
            )}
          </ProfileContainer>
        </MainContent>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const TopBarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 15%;
`;

const ContentWrapper = styled.div`
  height: 85%;
  padding: 3%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2%;
  width: 100%;
  height: 100%;
  align-items: flex-start;
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 20px;
`;

const CardWrapper = styled.div`
  padding: 10px;
`;

const HoverText = styled.div`
  position: fixed;
  pointer-events: none; /* Prevent mouse events on hover text */
  background: rgba(0, 0, 0, 0.8);
  color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
`;
