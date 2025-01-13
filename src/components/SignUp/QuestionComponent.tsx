import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/navigation";
import choiceData from "@/public/dummy/choice_data.json";
import { MoonLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import axios from "axios";

interface QuestionProps {
  onNext: () => void;
}

interface AnimatedWrapperProps {
  $isEntering: boolean;
}

export default function Question({ onNext }: QuestionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]); 
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Use hook at the top level
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true); // 브라우저 환경에서만 활성화
  }, []);

  const handleOptionClick = (choice: { text: string; personality: string }) => {
    setSelected(choice.text);
    setSelectedPersonalities((prev) => [...new Set([...prev, choice.personality])]);

    setTimeout(() => {
      setIsEntering(false); // Fade Out 애니메이션 트리거
      setTimeout(() => {
        if (currentStep < choiceData.length - 1) {
          setCurrentStep((prev) => prev + 1);
          setSelected(null);
          setIsEntering(true); // Fade In 애니메이션 트리거
        } else {
          setIsCompleted(true); // 질문 완료 상태로 전환
        }
      }, 300);
    }, 300);
  };
    // MongoDB에 성격 저장
  const savePersonality = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/savePersonality", {
        kakaouserId: "65b3c8f9d2f1234567abcd00", // 테스트용 ID
        personality: selectedPersonalities
      });
      alert("성격이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (isCompleted && isClient) {
      if (pathname === "/signup") {
        const timer = setTimeout(() => {
          router.push("/");
        }, 3000);
        return () => clearTimeout(timer);
      } else if (pathname === "/edit") {
        const timer = setTimeout(() => {
          router.push("/mypage");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isCompleted, isClient, pathname, router]);

  const getCompletionMessage = () => {
    if (pathname === "/signup") {
      return (
        <>
          완료되었습니다!
          <br />
          이제 카이스트에서 당신의 사랑을 찾아보세요!
        </>
      );
    } else if (pathname === "/edit") {
      return (
        <>
          수정이 완료되었습니다!
          <br />
          프로필이 성공적으로 업데이트되었습니다.
        </>
      );
    } else {
      return <>작업이 완료되었습니다!</>;
    }
  };

  return (
    <Wrapper>
      {!isCompleted ? (
        <AnimatedWrapper $isEntering={isEntering}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QuestionTitle>{choiceData[currentStep].question}</QuestionTitle>
          </div>
          <ButtonGroup>
            {choiceData[currentStep].choices.map((choice) => (
              <OptionButton
                key={choice.text}
                $isSelected={selected === choice.text}
                onClick={() => handleOptionClick(choice)}
              >
                {choice.text}
              </OptionButton>
            ))}
          </ButtonGroup>
        </AnimatedWrapper>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MoonLoader color="#ff7e86" loading size={40} speedMultiplier={0.7} />
          <CompletionMessage>{getCompletionMessage()}</CompletionMessage>
        </div>
      )}
    </Wrapper>
  );
}

// 스타일과 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const Wrapper = styled.div`
  padding: 10px;
  width: 80%;
  display: flex;
  flex-direction: column;
  height: auto;
  margin: 0 auto;
  radius: 5px;
  gap: 20px;
`;

const AnimatedWrapper = styled.div<AnimatedWrapperProps>`
  width: 100%;
  height: 100%;
  animation: ${(props) => (props.$isEntering ? fadeIn : fadeOut)} 0.3s forwards;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionTitle = styled.h1`
  font-size: 18px;
  color: #353131;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* 버튼을 중앙에 정렬 */
  gap: 20px;
`;

const OptionButton = styled.button<{ $isSelected: boolean }>`
  padding: 12px;
  border: 1px solid #ff7e86;
  border-radius: 8px;
  background-color: ${(props) => (props.$isSelected ? "#ffe6e9" : "#f5f5f5")};
  cursor: pointer;
  justify-content: center;
  width: 60%;
  text-align: center; /* 텍스트 중앙 정렬 */

  &:hover {
    background-color: #ffe6e9;
  }
`;

const CompletionMessage = styled.div`
  font-size: 24px;
  color: #353131;
  text-align: center;
  margin-top: 70px;
`;
