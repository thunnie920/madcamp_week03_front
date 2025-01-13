"use client";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import NewPerson from "@image/newPerson.png";
import AIImage from "@/public/images/aiimage.png";
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

export default function AISuggestionComponent() {
  return (
    <ChatContainer>
      <ImageContainer>
        <Image src={AIImage} alt="인공지능" />
      </ImageContainer>
    </ChatContainer>
  );
}

const ImageContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%; /* 이미지가 컨테이너의 너비를 꽉 채우도록 설정 */
  text-align: center;

  border: 1px solid #ff5a5a; /* 테두리 추가 */
  img {
    max-width: 100%; /* 부모 요소의 너비를 초과하지 않도록 설정 */
    max-height: 100%; /* 부모 요소의 높이를 초과하지 않도록 설정 */
    height: auto; /* 이미지 비율 유지 */
  }
`;

const ChatContainer = styled.div`
  position: relative; /* 하위 요소의 절대 위치 지정 기준이 되도록 설정 */
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 7px;
  height: 100%; /* 컨테이너 높이 설정 */
  border-radius: 5px;
  background-color: #f5f5f5;
  border: 1px solid blue; /* 테두리 추가 */
  padding: 7px;
  overflow: hidden; /* 이미지가 컨테이너 밖으로 나가지 않도록 숨김 처리 */
`;
