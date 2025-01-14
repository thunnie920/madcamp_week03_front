"use client";

import "@/src/styles/globals.css";
import styled, { keyframes } from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import ChatComponent from "@/src/components/ChatComponent";
import AISuggestionComponent from "@/src/components/AISuggestionComponent";
import { useState } from "react";
import { Main } from "next/document";

export default function Chat() {
  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <ChatContainer>
          <ChatComponent />
        </ChatContainer>
        <AISuggestionContainer>
          <AISuggestionComponent />
        </AISuggestionContainer>
      </ContentWrapper>
    </Wrapper>
  );
}

// 스타일 정의 (생략)

// 스타일 및 애니메이션 정의
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
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
`;

const ChatContainer = styled.div`
  width: 70%; /* 너비 비율 설정 */
  display: flex;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid #ff5a5a; /* 세로선 추가 */
  border: 1px solid black;
`;

const AISuggestionContainer = styled.div`
  width: 30%; /* 너비 비율 설정 */
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`;
