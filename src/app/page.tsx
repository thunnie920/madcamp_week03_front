"use client";
import { useEffect, useState } from "react";
import "@/src/styles/globals.css";
import styled from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OthersProfile from "@/src/components/OthersProfile";
import axios from "axios";

<<<<<<< HEAD
export default function Home() {

  const [user, setUser] = useState(null);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`);
              setUser(response.data);
          } catch (error) {
              console.error("로그인 상태를 불러오지 못했습니다.", error);
          }
      };
      fetchUser();
  }, []);
  
=======
interface OthersProfileProps {
  username: string;
  photo: string;
  status: string;
  similarity: number;
  intro: string;
  ideal: string;
  rating: number;
}

export default function MyPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<OthersProfileProps[]>([]);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/dummy/people_data.json");
        if (!res.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data: OthersProfileProps[] = await res.json();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (username: string) => {
    router.push(`/detail/${encodeURIComponent(username)}`);
  };

>>>>>>> front2
  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="여러분을 소개해보세요." />
        <MainContent>
          <SideBar title="프로필" />
          <ProfileList>
            {profiles.map((profile, index) => (
              <div
                key={index}
                onMouseMove={(event) =>
                  setHoverPosition({ x: event.clientX, y: event.clientY })
                }
                onMouseLeave={() => setHoverPosition(null)}
                onClick={() => handleProfileClick(profile.username)}
                style={{ cursor: "pointer" }}
              >
                <OthersProfile {...profile} />
              </div>
            ))}
          </ProfileList>
        </MainContent>
      </ContentWrapper>
      {hoverPosition && (
        <HoverText
          style={{ top: hoverPosition.y + 10, left: hoverPosition.x + 10 }}
        >
          더 알아보기
        </HoverText>
      )}
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

const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10%;
  overflow-y: auto;
  width: 100%;
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
