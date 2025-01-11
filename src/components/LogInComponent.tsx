"use client";
import styled from "styled-components";
import Image from "next/image";
import LogInBtn from "@/public/images/logInBtn.png";
import Logo from "@/public/images/logo.png";
import { easeIn, easeInOut, motion } from "framer-motion";

export default function LogInComponent() {
  const kakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨!");
    alert("카카오 로그인 버튼 클릭됨!");

    // backend 서버로 인가 코드를 요청한다. -> api 키와 리다이렉트 uri를 포함하여 보낸다.
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_type=code`;

  };
  /*const kakaoLogin = () => {
    window.location.href = "http://localhost:4000/auth/kakao"; // 백엔드 로그인 경로
  };*/

  /*
  const kakaoLogin = async () => {
	window.location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/kakao";
  };
  */

  return (
    <LogInContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: easeIn }}
    >
      <LogoContainer
        initial={{
          opacity: 0,
          y: +90,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 1.2, ease: easeInOut }}
      >
        <Image src={Logo} alt="logo" />
      </LogoContainer>
      <div onClick={kakaoLogin}>
        <Image src={LogInBtn} alt="로그인 버튼" />
      </div>
    </LogInContainer>
  );
}

const LogInContainer = styled(motion.div)`
  display: flex;
  width: 60%;
  height: 100vh;
  align-items: center;
  flex-direction: column;
  justify-content: center;
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
    height: 100%;
  }
`;

const WelcomeTitle = styled.div`
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 36px;
  font-weight: 600;
  color: #302d2d;
  margin: 0;
  text-align: center;
  width: 100%;
`;
