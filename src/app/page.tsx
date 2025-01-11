"use client";
import { useEffect, useState } from "react";
import "@/src/styles/globals.css";
import styled from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import OthersProfile from "@/src/components/OthersProfile";
import axios from "axios";

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
  
  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="대전에서 사랑을 찾아보세요." />
        <MainContent>
          <SideBar />
          <OthersProfile />
        </MainContent>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  gap: 2%; /* 컴포넌트 간 간격 */
  width: 100%;
  height: 100%;
  align-items: flex-start;

  /* Sidebar와 OthersProfile 간 비율 설정 */
  > div:first-child {
    flex-shrink: 0; /* SideBar는 축소되지 않음 */
  }
  > div:last-child {
    flex-grow: 1; /* OthersProfile은 남은 공간을 채움 */
  }
`;
