import React, { useState } from "react";
import styled from "styled-components";
import Camera from "@/src/components/SignUp/CameraComponent";
import Default from "@/public/images/default.png";
import Image from "next/image";

interface SecondSignUpProps {
  onNext: () => void;
}

export default function SecondSignUp({ onNext }: SecondSignUpProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true); // 카메라 활성 상태 관리
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(false); // 사진이 찍혔는지 상태 관리
  const [capturedImage, setCapturedImage] = useState<string | null>(null); 
  const [similarityScore, setSimilarityScore] = useState<number | null>(null); 

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsPhotoCaptured(true); // 사진 업로드 완료 상태로 설정
    }
  };

  const handlePhotoCaptured = (imageData: string) => {
    setIsPhotoCaptured(true); // 카메라에서 사진 촬영 완료 상태로 설정
    setIsCameraActive(false); // 카메라 비활성화
    setCapturedImage(imageData);
  };

  const isNextEnabled = isPhotoCaptured; // 사진이 업로드되거나 캡처되었을 때만 활성화

  const handleNextButtonClick = () => {
    if (isNextEnabled) {
      onNext(); // 다음 단계로 이동
    }
  };

    // ✅ 업로드 및 캡처 사진 비교 함수 (서버로 전송)
  const handleCompareImages = async () => {
    if (!selectedImage || !capturedImage) {
      alert("사진을 모두 업로드하거나 촬영해 주세요.");
      return;
    }

    const formData = new FormData();
    const uploadedBlob = await fetch(selectedImage).then(res => res.blob());
    const capturedBlob = await fetch(capturedImage).then(res => res.blob());
    formData.append("images", uploadedBlob, "uploaded.jpg");
    formData.append("images", capturedBlob, "captured.jpg");
    try {
        const response = await fetch("http://localhost:5000/api/compare-faces", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("서버 오류:", errorData);
            alert(`서버 오류 발생: ${errorData.error}`);
            return;
        }

        const result = await response.json();
        alert(`유사도 점수: ${result.score}`);
    } catch (error) {
        console.error("클라이언트 오류:", error);
        alert("이미지 비교 중 오류가 발생했습니다.");
    }
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <PhotoContainer>
          {/* 이미지를 클릭하면 파일 선택 트리거 */}
          <ImageWrapper
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            <Image
              src={selectedImage || Default}
              alt="photo"
              width={230}
              height={230}
            />
          </ImageWrapper>
          <HiddenFileInput
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </PhotoContainer>
        <CameraWrapper>
          {isCameraActive && <Camera onPhotoCaptured={handlePhotoCaptured} />}{" "}
          {/* 카메라 활성 상태에 따라 렌더링 */}
        </CameraWrapper>
      </ContentWrapper>
      {/* <ButtonContainer>
        <NextButton onClick={handleNextButtonClick} disabled={!isNextEnabled}>
          사진 업로드 하기
        </NextButton>
      </ButtonContainer> */}

      {/* ✅ 사진 비교 버튼 --> 나중에 삭제해야됨 */}
      <ButtonContainer>
        <NextButton onClick={handleCompareImages} disabled={!isPhotoCaptured}>
          사진 유사도 비교
        </NextButton>
      </ButtonContainer>
    </Wrapper>
  );
}

// 스타일 정의는 기존 코드 그대로 유지
const Wrapper = styled.div`
  padding: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  height: auto;
  margin: 0 auto;
  border-radius: 5px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 10px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  box-sizing: border-box;
`;

const PhotoContainer = styled.div`
  width: 30vw;
  max-width: 230px;
  position: relative;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CameraWrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: center;
`;

const NextButton = styled.button`
  background-color: #ff7e86;
  color: #f5f5f5;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #ff5a5a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
