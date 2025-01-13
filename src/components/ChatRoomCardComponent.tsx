"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";

interface ChatRoomCardProps {
  username: string;
  photo: string;
  id: number;
  status: string;
  onClick?: () => void;
}

export default function ChatRoomCard({
  username,
  photo,
  id,
  status,
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
          <Status>{status}</Status>
        </TextContainer>
      </ProfileWrapper>
      <BottomContainer>
        <IDBadge>{id}</IDBadge>
        <StatusHighlight>{status}</StatusHighlight>
      </BottomContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
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
  cursor: pointer;
`;

const PhotoContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ccc;
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
`;

const Username = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const Status = styled.div`
  font-size: 14px;
  color: #666;
`;

const BottomContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #eee;
  margin-top: 10px;
`;

const IDBadge = styled.div`
  background-color: #ff5e57;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 20px;
`;

const StatusHighlight = styled.div`
  background-color: #57a1ff;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 20px;
`;
