"use client";

import "@/src/styles/globals.css";
import styled from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import MyProfile from "@/src/components/MyProfie";

export default function MyPage() {
  return (
    <Wrapper>
      <Spacer />
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="여러분을 소개해보세요." />
        <MainContent>
          <SideBar title="프로필" />
          <MyProfile />
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

const Spacer = styled.div`
  height: 20px; /* Y축 위치 조정을 위한 여백 */
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
