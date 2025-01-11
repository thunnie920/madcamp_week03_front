"use client";

import "@/src/styles/globals.css";
import styled from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import OthersProfile from "@/src/components/OthersProfile";
import MyProfile from "../components/MyProfie";
import Link from "next/link";

export default function MyPage() {
  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="여러분을 소개해보세요." />
        <MainContent>
          <SideBar title="프로필" />
          <StyledLink href="/detail">
            <OthersProfile />
          </StyledLink>
        </MainContent>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 85vw;
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

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: inherit;
  cursor: pointer;
`;
