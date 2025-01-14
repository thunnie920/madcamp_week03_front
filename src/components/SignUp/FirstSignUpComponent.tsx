import React, { useState } from "react";
import styled from "styled-components";
import Heart from "@/public/images/heart.png";
import Pen from "@/public/images/pen.png";
import Person from "@/public/images/person.png";
import Image from "next/image";

interface FirstSignUpProps {
  onNext: (formData: {
    username: string;
    ideal: string;
    intro: string;
    status: string;
  }) => void;
  initialData: {
    username: string;
    ideal: string;
    intro: string;
    status: string;
  };
}


// 페이지 컴포넌트
export default function FirstSignUp({ onNext, initialData }: FirstSignUpProps) {
  const [formData, setFormData] = useState({
    username: initialData.username || "",
    ideal: initialData.ideal || "",
    intro: initialData.intro || "",
    status: initialData.status || "",
  });
  // const isNextEnabled =
  //   nickname.trim() !== "" &&
  //   idealType.trim() !== "" &&
  //   introduction.trim() !== "" &&
  //   selected !== null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionClick = (status: string) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleNextClick = () => {
    if (!formData.username || !formData.ideal || !formData.intro || !formData.status) {
      alert("모든 정보를 입력해주세요!");
      return;
    }
    // ✅ API 호출
    onNext(formData);
  };


  return (
    <Wrapper>
      <InputWrapper>
        {/* 닉네임 입력 필드 */}
        <InputContainer>
          <IconWrapper>
            <Image src={Person} alt="person" width={20} height={20} />
          </IconWrapper>
          <Input
            name="username"
            type="text"
            placeholder="닉네임을 설정해주세요"
            aria-label="닉네임"
            value={formData.username}
            onChange={handleInputChange}
          />
        </InputContainer>

        {/* 이상형 입력 필드 */}
        <InputContainer>
          <IconWrapper>
            <Image src={Heart} alt="heart" width={20} height={20} />
          </IconWrapper>
          <Input
            name="ideal"
            type="text"
            placeholder="이상형을 작성해주세요"
            aria-label="이상형"
            value={formData.ideal}
            onChange={handleInputChange}
          />
        </InputContainer>

        {/* 자기소개 입력 필드 */}
        <InputContainer>
          <IconWrapper>
            <Image src={Pen} alt="pen" width={20} height={20} />
          </IconWrapper>
          <Input
             name="intro"
            type="text"
            placeholder="자기 소개를 작성해주세요"
            value={formData.intro}
            onChange={handleInputChange}
          />
        </InputContainer>

        {/* 선택 버튼 */}
        <ButtonGroup>
          <OptionButton
            $isSelected={formData.status === "single"}
            onClick={() => handleOptionClick("single")}
          >
            한 번 대화 시작 시 한 명과만 대화를 이어나가고 싶어요.
            <br />
            (상대도 1명과만 대화가 가능합니다)
          </OptionButton>
          <OptionButton
            $isSelected={formData.status === "multiple"}
            onClick={() => handleOptionClick("multiple")}
          >
            여러 명을 알아가고 싶어요. <br />
            (상대도 여러 명과 동시 대화가 가능합니다)
          </OptionButton>
        </ButtonGroup>
      </InputWrapper>

      {/* 다음 버튼 */}
      <ButtonContainer>
        <NextButton type="button" onClick={handleNextClick}>
          다음으로 넘어가기
        </NextButton>
      </ButtonContainer>
    </Wrapper>
  );
}

// 공통 스타일 정의
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

const InputWrapper = styled.div`
  padding: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
  height: auto;
  margin: auto;
  radius: 5px;
  border: 1px solid #ff7e86;
  border-radius: 5px;
  box-sizing: border-box;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 5px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  margin-right: 8px;
  color: #ff7e86;
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: #333;

  &::placeholder {
    color: #6a6161;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  margin-top: 16px;
`;

interface OptionButtonProps {
  $isSelected: boolean;
}

const OptionButton = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  padding: 12px;
  border: 1px solid #ff7e86;
  border-radius: 8px;
  background-color: ${(props) => (props.$isSelected ? "#ffe6e9" : "#f5f5f5")};
  color: #353131;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #ffe6e9;
    color: #353131;
  }
`;

// 수정 내용: $isSelected를 사용하고, styled-components가 DOM에 prop을 전달하지 않도록 transient prop을 유지합니다.

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