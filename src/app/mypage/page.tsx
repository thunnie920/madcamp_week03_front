"use client";

import "@/src/styles/globals.css";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import MyProfile from "@/src/components/MyProfie";

interface MyProfileProps {
  username: string;
  photo: string;
  status: string;
  similarity: number;
  intro: string;
  ideal: string;
  rating: number;
  onClick?: () => void;
}

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MyProfileProps | null>(null);

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

  const handleProfileClick = () => {
    router.push("/edit");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/dummy/people_data.json");
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data: MyProfileProps[] = await res.json();
        setProfile(data[0]); // 첫 번째 프로필만 설정
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="여러분을 소개해보세요." />
        <MainContent>
          <SideBar title="프로필" />
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ border: "1px solid purple", width: "100px" }}
          >
            {/* onClick prop 넘겨주기 */}
            <MyProfile onClick={handleProfileClick} />
            {hoverPosition && (
              <HoverText
                style={{
                  top: hoverPosition.y + 10,
                  left: hoverPosition.x + 10,
                }}
              >
                프로필 수정하기
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
  height: 100%;
  align-items: flex-start;
  border: 1px solid blue;

  /* Sidebar와 ProfileContainer의 비율 설정 */
  > div:first-child {
    flex-shrink: 0;
  }
  > div:last-child {
    flex-grow: 1; /* ProfileContainer가 남은 공간을 채우도록 */
  }
`;

const HoverText = styled.div`
  position: fixed;
  pointer-events: none; /* 마우스 이벤트 방지 */
  background: rgba(0, 0, 0, 0.8);
  color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
`;
