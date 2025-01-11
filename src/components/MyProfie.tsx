"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MyProfileProps {
  username: string;
  photo: string;
  status: string;
  similarity: number;
  intro: string;
  ideal: string;
  rating: number;
}

export default function MyProfile() {
  const [profile, setProfile] = useState<MyProfileProps | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent,
    item: {
      intro: string;
      ideal: string;
    }
  ) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      content: `자기 소개: ${item.intro}\n이상형: ${item.ideal}`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/dummy/people_data.json");
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data: MyProfileProps[] = await res.json();
        console.log("Fetched profile:", data[0]); // 첫 번째 데이터 확인
        setProfile(data[0]); // 첫 번째 요소만 설정
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
    <div>
      <Wrapper>
        <ProfileWrapper>
          <PhotoContainer>
            <Image
              src={profile.photo}
              alt={`${profile.username}의 프로필 사진`}
              width={200}
              height={200}
              onMouseEnter={(e) =>
                handleMouseEnter(e, {
                  intro: profile.intro,
                  ideal: profile.ideal,
                })
              }
              onMouseLeave={handleMouseLeave}
            />
          </PhotoContainer>
          <InfoContainer>
            <UserNameContainer>
              <UserName
                onMouseEnter={(e) =>
                  handleMouseEnter(e, {
                    intro: profile.intro,
                    ideal: profile.ideal,
                  })
                }
                onMouseLeave={handleMouseLeave}
              >
                {profile.username}
              </UserName>
            </UserNameContainer>
            <StatusContainer>
              <StatusText>
                {profile.status === "single"
                  ? "나와만 얘기해줘요"
                  : "여러 명과 얘기해도 괜찮아요"}
              </StatusText>
            </StatusContainer>
            <TextContainer
              onMouseEnter={(e) =>
                handleMouseEnter(e, {
                  intro: profile.intro,
                  ideal: profile.ideal,
                })
              }
              onMouseLeave={handleMouseLeave}
            >
              <Text>프로필 사진과의 유사도</Text>
              <div style={{ gap: "3px", display: "flex" }}>
                <Text3>{profile.similarity}</Text3>
                <Text4>%</Text4>
              </div>
            </TextContainer>
            <TextContainer
              onMouseEnter={(e) =>
                handleMouseEnter(e, {
                  intro: profile.intro,
                  ideal: profile.ideal,
                })
              }
              onMouseLeave={handleMouseLeave}
            >
              <Text>자기 소개</Text>
              <Text2>{profile.intro}</Text2>
            </TextContainer>
            <TextContainer
              onMouseEnter={(e) =>
                handleMouseEnter(e, {
                  intro: profile.intro,
                  ideal: profile.ideal,
                })
              }
              onMouseLeave={handleMouseLeave}
            >
              <Text>이상형</Text>
              <Text2>{profile.ideal}</Text2>
            </TextContainer>
            <TextContainer
              onMouseEnter={(e) =>
                handleMouseEnter(e, {
                  intro: profile.intro,
                  ideal: profile.ideal,
                })
              }
              onMouseLeave={handleMouseLeave}
            >
              <Text>사람들의 별점 후기</Text>
              <div style={{ gap: "3px", display: "flex" }}>
                <Text4>평균 </Text4>
                <Text3>{profile.rating}</Text3>
                <Text4>점</Text4>
              </div>
            </TextContainer>
          </InfoContainer>
        </ProfileWrapper>
      </Wrapper>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x - 200,
            backgroundColor: "rgba(240, 240, 240, 0.8)",
            color: "#353131",
            padding: "5px",
            borderRadius: "4px",
            pointerEvents: "none",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <pre>{tooltip.content}</pre>
        </div>
      )}
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  margin-top: 80px;
  width: 80%; /* 부모 요소의 전체 너비 사용 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`;

const ProfileWrapper = styled.div`
  width: 100%; /* 부모 컨테이너의 너비를 기준으로 */
  max-width: 100%; /* 최대 너비 제한 */
  padding: 0;
  margin-bottom: 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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
  width: flex;
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
`;
const Text4 = styled.h3`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 20px;
  color: #353131;
  margin: 0;
`;
