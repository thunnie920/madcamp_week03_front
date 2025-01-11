import React, { useState } from "react";
import styled from "styled-components";
import Camera from "@/src/components/SignUp/CameraComponent";
import Profile1 from "@/public/images/people/profile_1.jpg";
import Image from "next/image";

// 페이지 컴포넌트
export default function SecondSignUp() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelected(option);
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <PhotoContainer>
          <Image src={Profile1} alt="photo" />
        </PhotoContainer>
        <CameraWrapper>
          <Camera />
        </CameraWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

// 공통 스타일 정의
const Wrapper = styled.div`
  padding: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-top: 80px;
  height: auto;
  margin: 0 auto;
  border-radius: 5px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
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

const CameraWrapper = styled.div`
  flex-grow: 1;
  padding: 10px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  box-sizing: border-box;
`;
