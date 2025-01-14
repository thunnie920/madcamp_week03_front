"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";

// 사용자 정보를 담는 인터페이스
interface UserProfile {
  username: string;
  photo: string;
  status: string;
  similarity: number;
  intro: string;
  ideal: string;
  rating: number;
}

// MyProfile 컴포넌트의 Prop 타입
interface MyProfileProps {
  onClick?: () => void; // 부모에서 받아올 클릭 핸들러
}

export default function MyProfile({ onClick }: MyProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // 컴포넌트 마운트 시점에 프로필 정보를 가져옴
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 실제 DB/API에서 사용자 정보를 받아오는 로직
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/userprofile`,
          {
            credentials: "include", // 쿠키 등 인증정보 포함
          }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data: UserProfile = await res.json();
        setProfile(data);
      } catch (err) {
        setError("프로필 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !profile) {
    return <div>{error || "프로필 정보를 불러올 수 없습니다."}</div>;
  }

  // 내부 클릭 핸들러
  const handleClick = () => {
    console.log(`${profile.username}의 프로필이 클릭되었습니다.`);
    // 부모로부터 받은 onClick이 있다면 실행
    if (onClick) {
      onClick();
    }
  };

  return (
    <Wrapper onClick={handleClick}>
      <PhotoContainer>
        <Image
          src={profile.photo}
          alt={`${profile.username}의 프로필 사진`}
          width={200}
          height={200}
        />
      </PhotoContainer>
      <InfoContainer>
        <UserNameContainer>
          <UserName>{profile.username}</UserName>
        </UserNameContainer>
        <StatusContainer>
          <StatusText>
            {profile.status === "single"
              ? "나와만 얘기해줘요"
              : "여러 명과 얘기해도 괜찮아요"}
          </StatusText>
        </StatusContainer>
        <TextContainer>
          <Text>프로필 사진과의 유사도</Text>
          <div style={{ gap: "3px", display: "flex" }}>
            <Text3>{profile.similarity}</Text3>
            <Text4>%</Text4>
          </div>
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
          <div style={{ gap: "3px", display: "flex" }}>
            <Text4>평균 </Text4>
            <Text3>{profile.rating}</Text3>
            <Text4>점</Text4>
          </div>
        </TextContainer>
      </InfoContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  padding: 20px;
  margin-top: 50px;
  width: 100%; /* 부모 요소의 전체 너비 사용 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
  border: 1px solid red;
  align-items: center;
`;

const PhotoContainer = styled.div`
  width: 30vw;
  max-width: 230px;
  height: 30vw;
  max-height: 230px;
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
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 14px;
  overflow: hidden;
  justify-content: space-between; /* 요소 간 간격 균등 배치 */
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
  max-width: 100%; /* 부모 요소를 기준으로 설정 */
  width: 100%; /* 고정 너비 */
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
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 18px;
  color: #353131;
  margin: 0;
  white-space: normal; /* 여러 줄 허용 */
  word-break: break-word; /* 단어가 너무 길 경우 줄바꿈 */
  overflow: visible; /* 텍스트 숨김 해제 */
  width: 50vw; /* 고정 너비로 일관성 유지 */
  flex-grow: 0; /* 유동적인 크기 비율 제거 */
  line-height: 1.5; /* 줄간격 설정 (폰트 크기의 1.5배) */
`;

const Text3 = styled.h3`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 20px;
  color: #ff5a5a;
`;

const Text4 = styled.h3`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 20px;
  color: #353131;
  margin: 0;
`;
