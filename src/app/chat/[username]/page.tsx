"use client";

import "@/src/styles/globals.css";
import styled from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import ChatRoomCard from "@/src/components/ChatRoomCardComponent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ChatRoomCardProps {
  username: string;
  photo: string;
  id: number;
  status: string;
  onClick?: () => void;
}

export default function Detail() {
  const router = useRouter();
  const [chatRoomCard, setChatRoomCard] = useState<ChatRoomCardProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const rawUsername = window.location.pathname.split("/").pop();
      if (!rawUsername) {
        setError("Invalid username");
        setIsLoading(false);
        return;
      }

      const username = decodeURIComponent(rawUsername);

      setIsLoading(true);
      try {
        const res = await fetch("/dummy/chatroom_data.json");
        if (!res.ok) {
          throw new Error("Failed to fetch profiles");
        }

        const data: ChatRoomCardProps[] = await res.json();
        const user = data.find((item) => item.username === username);
        if (!user) {
          throw new Error("Profile not found");
        }

        setChatRoomCard(user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!chatRoomCard) return <p>No data available</p>;

  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="채팅방에서 사랑을 시작해보세요" />
        <MainContent>
          <SideBar title="님의 채팅방" highlight={chatRoomCard.username} />
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ border: "1px solid purple", padding: "20px" }}
          >
            <ChatRoomCard {...chatRoomCard} />
            {hoverPosition && (
              <HoverText
                style={{
                  top: hoverPosition.y + 10,
                  left: hoverPosition.x + 10,
                }}
              >
                채팅방 들어가기
              </HoverText>
            )}
          </div>
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
  align-items: flex-start;
  border: 1px solid blue;
  overflow: hidden;

  > div:first-child {
    flex-shrink: 0;
    max-width: 20%;
  }

  > div:last-child {
    flex-grow: 1;
    max-width: 80%;
    overflow: hidden;
  }
`;

const HoverText = styled.div`
  position: fixed;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.8);
  color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
`;
