"use client";

import { motion } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import selectedStar from "@/public/images/selectedStar.png";
import unselectedStar from "@/public/images/unselectedStar.png";

interface OthersReviewProps {
  username: string;
  photo: string;
  rating: number;
  period: number;
  review: string;
}

export default function OthersReview({
  username,
  photo,
  rating,
  period,
  review,
}: OthersReviewProps) {
  console.log("Received username:", username); // 디버깅용

  return (
    <div>
      <Wrapper>
        <PhotoContainer>
          <Image
            src={photo}
            alt={`${username}의 프로필 사진`}
            width={200}
            height={200}
          />
        </PhotoContainer>
        <InfoContainer>
          <UserNameContainer>
            <UserName>{username || "Unknown User"}</UserName>
          </UserNameContainer>
          <StarContainer>
            {Array.from({ length: 5 }).map((_, index) => (
              <Image
                key={index}
                src={index < rating ? selectedStar : unselectedStar}
                alt={index < rating ? "선택된 별" : "선택되지 않은 별"}
                width={20}
                height={20}
              />
            ))}
          </StarContainer>
          <TextContainer>
            <Text>대화기간</Text>
            <div style={{ gap: "3px", display: "flex" }}>
              <Text3>{period}</Text3>
              <Text4>일</Text4>
            </div>
          </TextContainer>
          <TextContainer>
            <Text>평가</Text>
            <Text2>{review}</Text2>
          </TextContainer>
        </InfoContainer>
      </Wrapper>
    </div>
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
  justify-content: center;
  gap: 14px;
  overflow: hidden;
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

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
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
