import React, { useState } from "react";
import styled from "styled-components";
import Camera from "@/src/components/SignUp/CameraComponent";
import Default from "@/public/images/default.png";
import Image from "next/image";
import { SyncLoader } from "react-spinners";

interface SecondSignUpProps {
  onNext: () => void;
}

export default function SecondSignUp({ onNext }: SecondSignUpProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true); // 카메라 활성 상태 관리
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(false); // 사진이 찍혔는지 상태 관리
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 관리

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

    setIsLoading(true); // 로딩 상태 활성화

    const formData = new FormData();
    const uploadedBlob = await fetch(selectedImage).then((res) => res.blob());
    const capturedBlob = await fetch(capturedImage).then((res) => res.blob());

    formData.append("profileImage", uploadedBlob, "uploaded.jpg");
    formData.append("capturedImage", capturedBlob, "captured.jpg");

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
      setSimilarityScore(result.score);

      const updateFormData = new FormData();
      updateFormData.append("profileImage", uploadedBlob, "uploaded.jpg");
      updateFormData.append("similarity", result.score.toString());

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update-similarity`,
        {
          method: "PUT",
          credentials: "include",
          body: updateFormData,
        }
      );

      if (updateResponse.ok) {
        alert(`✅ 유사도 점수(${result.score})가 성공적으로 저장되었습니다!`);
      } else {
        const errorData = await updateResponse.json();
        alert(`❌ 유사도 점수 저장 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("클라이언트 오류:", error);
      alert("이미지 비교 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 작업 완료 후 로딩 상태 비활성화
    }
  };

  return (
    <Wrapper>
      {/* 1) 사진 업로드 & 촬영 화면 */}
      {!isLoading && similarityScore === null && (
        <>
          <ContentWrapper>
            <PhotoContainer>
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
              {/* 카메라 컴포넌트 */}
              <Camera onPhotoCaptured={handlePhotoCaptured} />
            </CameraWrapper>
          </ContentWrapper>

          {/* 사진 유사도 비교 버튼 */}
          <ButtonContainer>
            <NextButton
              onClick={handleCompareImages}
              disabled={!isPhotoCaptured}
            >
              사진 유사도 비교
            </NextButton>
          </ButtonContainer>
        </>
      )}

      {/* 2) 로딩 화면 */}
      {isLoading && (
        <LoadingWrapper>
          <SyncLoader color="#ff5a5a" loading />
          <Text>
            잠시만 기다려 주세요.
            <br />
            유사도 검증 진행 중입니다...
          </Text>
        </LoadingWrapper>
      )}

      {/* 3) 유사도 검사 결과 화면 */}
      {!isLoading && similarityScore !== null && (
        <>
          <ResultText>
            유사도 점수: <strong>{similarityScore}</strong>
          </ResultText>
          <ButtonContainer>
            <NextButton onClick={handleNextButtonClick}>
              다음 단계로 이동
            </NextButton>
          </ButtonContainer>
        </>
      )}
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

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
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

const Text = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: rgba(53, 49, 49, 0.68);
  margin: 0;
  text-align: center; 1
  width: 100%;
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

const ResultWrapper = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const ResultText = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;
