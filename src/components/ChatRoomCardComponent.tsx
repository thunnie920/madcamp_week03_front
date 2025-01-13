"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";

interface ChatRoomCardProps {
  username: string;
  photo: string;
  id: number;
  status: string;
  lastchatdate: number;
  onClick?: () => void;
}

export default function ChatRoomCard({
  username,
  photo,
  id,
  status,
  lastchatdate,
  onClick,
}: ChatRoomCardProps) {
  return (
    <Wrapper>
      <ProfileWrapper onClick={onClick}>
        <PhotoContainer>
          <img src={photo} alt={`${username}'s profile`} />
        </PhotoContainer>
        <TextContainer>
          <Username>{username}</Username>
          <Text>님과의 채팅방</Text>
        </TextContainer>
      </ProfileWrapper>
      <BottomContainer>
        <TextContainer2>
          <Text2>마지막 대화 </Text2>
          <Date>{lastchatdate}</Date>
          <Text2> 일 전 </Text2>
        </TextContainer2>
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            justifyContent: "flex-start",
            background: "rgba(255, 255, 255, 0.65)",
          }}
        >
          <StatusContainer status={status}>
            <StatusText status={status}>
              {status === "red"
                ? "레드라이트"
                : status === "green"
                ? "그린라이트"
                : "아직 잘 모르겠어요"}
            </StatusText>
          </StatusContainer>
        </div>
      </BottomContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.65);
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
`;

const PhotoContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.65);
`;

const TextContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.65);
`;

const Username = styled.div`
  background-color: rgba(255, 255, 255, 0.65);
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 20px;
  color: #ff5a5a;
`;

const Date = styled.div`
  background-color: rgba(255, 255, 255, 0.65);
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #ff5a5a;
`;

const Text = styled.h2`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #353131;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.65);
  min-width: 200px;
  text-align: left;
`;

const Text2 = styled.h2`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 14px;
  color: #353131;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.65);
`;

const BottomContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
  margin-top: 10px;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.65);
`;

const StatusContainer = styled.div<{ status: string }>`
  display: flex;
  width: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 5px;
  margin: 3px;
  border-radius: 100px;
  border: 1px solid
    ${({ status }) =>
      status === "red"
        ? "#ff5a5a"
        : status === "green"
        ? "#86ff5a"
        : "#ffe35a"};
  background-color: ${({ status }) =>
    status === "red" ? "#fff0f0" : status === "green" ? "#f0fff0" : "#f9f9f9"};
`;

const StatusText = styled.h2<{ status: string }>`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 12px;
  color: #353131;
  margin: 0;
  background-color: ${({ status }) =>
    status === "red" ? "#fff0f0" : status === "green" ? "#f0fff0" : "#f9f9f9"};
`;
