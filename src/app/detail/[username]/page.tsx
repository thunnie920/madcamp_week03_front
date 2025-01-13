"use client";

import "@/src/styles/globals.css";
import styled from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OthersProfile from "@/src/components/OthersProfile";
import OthersReview from "@/src/components/OthersReview";
import Link from "next/link";

interface ProfileDetailsProps {
  username: string;
  photo: string;
  status: string;
  similarity: number;
  intro: string;
  ideal: string;
  rating: number;
}

interface OthersReviewProps {
  username: string;
  photo: string;
  rating: number;
  period: number;
  review: string;
}

export default function Detail() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDetailsProps>({
    username: "",
    photo: "",
    status: "",
    similarity: 0,
    intro: "",
    ideal: "",
    rating: 0,
  });
  const [reviews, setReviews] = useState<OthersReviewProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const rawUsername = window.location.pathname.split("/").pop();
      if (!rawUsername) {
        setError("Invalid username");
        return;
      }

      const username = decodeURIComponent(rawUsername); // URL에서 디코딩
      console.log("Decoded username:", username); // 디버깅용 로그

      setIsLoading(true);
      try {
        const res = await fetch("/dummy/people_data.json");
        const res2 = await fetch("/dummy/review_data.json");
        if (!res.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data: ProfileDetailsProps[] = await res.json();
        const data2: OthersReviewProps[] = await res2.json();
        console.log("Fetched data:", data); // 디버깅용 로그

        const user = data.find((item) => item.username === username);
        if (!user) {
          throw new Error("Profile not found");
        }

        setProfile(user);
        setReviews(data2);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Wrapper>
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="당신은 누구인가요?" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "50px",
            padding: "0px",
            margin: "0px",
            width: "100%",
          }}
        >
          <MainContent>
            <SideBar title="님의 프로필" highlight={profile.username} />
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ border: "1px solid purple" }}
            >
              <OthersProfile {...profile} />
              {hoverPosition && (
                <HoverText
                  style={{
                    top: hoverPosition.y + 10,
                    left: hoverPosition.x + 10,
                  }}
                >
                  대화 시작하기
                </HoverText>
              )}
            </div>
          </MainContent>
          <MainContent>
            <SideBar title="님이 받은 평가" highlight={profile.username} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                width: "100%",
                overflow: "hidden",
              }}
            >
              {reviews.map((review, index) => {
                console.log("Rendering profile:", review);
                return <OthersReview key={index} {...review} />;
              })}
            </div>
          </MainContent>
        </div>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
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
  gap: 2%;
  width: 100%;
  align-items: flex-start;
  border: 1px solid blue;
  overflow: hidden;

  /* 자식 컨테이너의 비율 설정 */
  > div:first-child {
    flex-shrink: 0;
    max-width: 20%; /* Sidebar의 최대 너비 제한 */
  }
  > div:last-child {
    flex-grow: 1;
    max-width: 80%; /* ProfileContainer의 최대 너비 제한 */
    overflow: hidden; /* ProfileContainer 내용 넘침 방지 */
  }
`;

const HoverText = styled.div`
  position: fixed;
  pointer-events: none; /* 마우스 이벤트 방지 */
  background: rgba(0, 0, 0, 0.8);
  color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
`;
