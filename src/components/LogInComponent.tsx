"use client";
import styled from "styled-components";
import Image from "next/image";
import LogInBtn from "@/public/images/logInBtn.png";
import Logo from "@/public/images/frontLogo.png";
import { easeIn, easeInOut, motion } from "framer-motion";

export default function LogInComponent() {
  const kakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨!");
    alert("카카오 로그인 버튼 클릭됨!");

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_type=code`;
  };

  return (
    <LogInContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: easeIn }}
    >
      <LogoContainer
        initial={{
          opacity: 0,
          y: 90,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 1.2, ease: easeInOut }}
      >
        <Image src={Logo} alt="로고" />
      </LogoContainer>
      <BtnContainer>
        <WelcomeTitle>이제는 카이스트에서 사랑하세요</WelcomeTitle>
        <LoginButton onClick={kakaoLogin}>
          <Image src={LogInBtn} alt="카카오 로그인 버튼" />
        </LoginButton>
      </BtnContainer>
    </LogInContainer>
  );
}

const LogInContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 41px;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 100%;
    height: auto;
  }
`;

const BtnContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 80vw;
  align-items: flex-start;
  gap: 8px;
`;

const WelcomeTitle = styled.div`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 40px;
  color: #353131;
  margin: 0;
  text-align: left;
  width: 100%;
`;

const LoginButton = styled.div`
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
  }
`;
