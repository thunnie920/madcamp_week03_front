"use client";

import "@/src/styles/globals.css";
import styled, { keyframes } from "styled-components";
import TopBar from "@/src/components/TopBarComponent";
import WelcomeText from "@/src/components/welcomeTextComponent";
import SideBar from "@/src/components/SideBarComponent";
import FirstSignUp from "@/src/components/SignUp/FirstSignUpComponent";
import SecondSignUp from "@/src/components/SignUp/SecondSignUpComponent";
import Question from "@/src/components/SignUp/QuestionComponent";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ FormDataType을 수정하여 photo와 similarity 포함
interface FormDataType {
  username: string;
  ideal: string;
  intro: string;
  status: string;
  personality: string[];
  photo: string;
  similarity: number | null;
}

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState<"first" | "second" | "question">("first");
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    ideal: "",
    intro: "",
    status: "",
    personality: [],
    photo: "",
    similarity: null,
  });

  const router = useRouter();

  // ✅ 기존 데이터 유지 & photo, similarity만 업데이트 (SecondSignUp 전용)
  const handleNext = async (updatedData: Partial<FormDataType>): Promise<void> => {
    // ✅ 최신 데이터 병합 후, 상태를 바로 업데이트
    const updatedFormData = {
      ...formData,
      photo: updatedData.photo ?? formData.photo,
      similarity: updatedData.similarity ?? formData.similarity,
      personality: updatedData.personality
        ? [...new Set([...formData.personality, ...updatedData.personality])]
        : formData.personality,
      ...updatedData,
    };

    setFormData(updatedFormData);

    if (currentStep === "question") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedFormData)
        });
        if (response.ok) {
          alert("✅ 프로필이 성공적으로 업데이트되었습니다!");
          router.push("/");
        } else {
          const errorData = await response.json();
          alert(`❌ 오류 발생: ${errorData.message}`);
        }
      } catch (error) {
        console.error("❌ 서버 오류:", error);
      }
    } else {
      // ✅ 다음 단계로 이동
      setCurrentStep((prevStep) =>
        prevStep === "first" ? "second" : prevStep === "second" ? "question" : "first"
      );
    }
    // if (currentStep !== "question") {
    //   setCurrentStep((prevStep) =>
    //     prevStep === "first" ? "second" : prevStep === "second" ? "question" : "first"
    //   );
    // }
  };

  return (
    <Wrapper>
      <Spacer />
      <TopBarWrapper>
        <TopBar />
      </TopBarWrapper>
      <ContentWrapper>
        <WelcomeText text="여러분에 대해 알려주세요." />
        <MainContent>
          <SideBar title="프로필 설정" />
          {currentStep === "first" && (
            <AnimatedWrapper key="first" $isEntering={currentStep === "first"}>
              <FirstSignUp onNext={(updatedData) =>
                    handleNext({
                        username: updatedData.username,
                        ideal: updatedData.ideal,
                        intro: updatedData.intro,
                        status: updatedData.status
                    })
                }
                initialData={formData}
                />
            </AnimatedWrapper>
          )}
          {currentStep === "second" && (
            <AnimatedWrapper key="second" $isEntering={currentStep === "second"}>
              {/* ✅ SecondSignUp에서는 photo와 similarity만 업데이트 */}
              <SecondSignUp
                onNext={async (updatedData) =>
                  await handleNext({ photo: updatedData.photo, similarity: updatedData.similarity })
                }
                initialData={formData}
              />
            </AnimatedWrapper>
          )}
          {currentStep === "question" && (
            <AnimatedWrapper key="question" $isEntering={currentStep === "question"}>
              {/* ✅ Question 컴포넌트는 personality만 업데이트 */}
              <Question
                onNext={(updatedData) => handleNext({ personality: updatedData.personality })}
              />
            </AnimatedWrapper>
          )}
        </MainContent>
      </ContentWrapper>
    </Wrapper>
  );
}

// 스타일 정의 (생략)

// 스타일 및 애니메이션 정의
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Spacer = styled.div`
  height: 20px; /* Y축 위치 조정을 위한 여백 */
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
  flex-direction: column;
  gap: 2%;
  width: 100%;
  height: 100%;
  align-items: flex-start;

  > div:first-child {
    flex-shrink: 0; /* SideBar는 축소되지 않음 */
  }
  > div:last-child {
    flex-grow: 1; /* 중앙 콘텐츠가 남은 공간을 채움 */
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

interface AnimatedWrapperProps {
  $isEntering: boolean;
}

const AnimatedWrapper = styled.div<AnimatedWrapperProps>`
  width: 100%;
  height: 100%;
  animation: ${(props) => (props.$isEntering ? slideIn : slideOut)} 0.5s
    forwards;
  display: flex;
  flex-direction: column;
`;