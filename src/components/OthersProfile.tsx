"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";

interface OthersProfileProps {
  username: string;
  photo: string;
  status: string;
  similarity: number;
  intro: string;
  ideal: string;
  rating: number;
}

export default function OthersProfile() {
  const [profiles, setProfiles] = useState<OthersProfileProps[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/dummy/people_data.json");
        if (!res.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data: OthersProfileProps[] = await res.json();
        console.log("Fetched profiles:", data); // 데이터 확인
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  if (profiles.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      {profiles.map((profile, index) => (
        <ProfileWrapper>
          <PhotoContainer>
            <Image
              src={profile.photo}
              alt={`${profile.username}의 프로필 사진`}
            />
          </PhotoContainer>
          <InfoContainer>
            <UserNameContainer>
              <UserName>{profile.username}</UserName>
            </UserNameContainer>
            <StatusContainer>
              <StatusText>
                {profile.status === "single"
                  ? "혼자인 게 좋아요"
                  : "여러 명이어도 괜찮아요"}
              </StatusText>
            </StatusContainer>
            <TextContainer>
              <Text>프로필 사진과의 유사도</Text>
              <Text3>{profile.similarity}</Text3>
              <Text2>%</Text2>
            </TextContainer>
            <TextContainer>
              <Text>자기 소개</Text>
              <Text2>{profile.intro}</Text2>
            </TextContainer>
            <TextContainer>
              <Text>이상형</Text>
              <Text2>{profile.ideal}</Text2>
            </TextContainer>
            <TextContainer>
              <Text>사람들의 별점 후기</Text>
              <Text2>평균</Text2>
              <Text3>{profile.rating}</Text3>
              <Text2>점</Text2>
            </TextContainer>
          </InfoContainer>
        </ProfileWrapper>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  width: 100%; /* 부모 요소의 전체 너비 사용 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`;

const ProfileWrapper = styled.div`
  width: 100%; /* 부모 컨테이너의 너비를 기준으로 */
  max-width: 75%; /* 최대 너비 제한 */
  padding: 10px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  box-sizing: border-box; /* 안정적인 크기 계산 */
`;

const PhotoContainer = styled.div`
  width: 30vw;
  max-width: 230px;
  aspect-ratio: 1;
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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 14px;
  flex-grow: 1;
  min-width: 0;
`;

const UserNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
`;

const UserName = styled.h1`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 20px;
  color: #ff5a5a;
  margin: 0;
`;

const StatusContainer = styled.div`
  display: flex;
  width: 150px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border-radius: 100px;
  border: 1px solid #ff5a5a;
  background-color: #f5f5f5;
`;

const StatusText = styled.h2`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 14px;
  color: #353131;
  margin: 0;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 14px;
  max-width: 100%;
  overflow: hidden;
`;

const Text = styled.h2`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 20px;
  color: #353131;
  margin: 0;
  min-width: 200px;
  text-align: left;
`;

const Text2 = styled.h2`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 20px;
  color: #353131;
  margin: 0;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 200px);
`;

const Text3 = styled.h3`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  color: #ff5a5a;
  margin: 0;
`;
