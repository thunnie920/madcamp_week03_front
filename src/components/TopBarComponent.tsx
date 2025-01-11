"use client";

import { easeInOut, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Flex } from "@/src/libs/flex";
import Image from "next/image";
import Logo from "@/public/images/logo.png";

export default function TopBar() {
  const pathname = usePathname();
  const navControls = useAnimation();
  const isHome = pathname === "/";

  const navigationAnimation = useCallback(async () => {
    await navControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeInOut" },
    });
  }, [navControls]);

  useEffect(() => {
    if (isHome) {
      navigationAnimation();
    }
  }, [navigationAnimation, isHome]);

  return (
    <Wrapper
      initial={isHome ? { opacity: 1, y: 0 } : { opacity: 0, y: -90 }}
      animate={navControls}
    >
      <LogoContainer>
        <StyledLink href="/">
          <TitleContainer>
            <Title>KAIST - </Title>
            <Title2>IN</Title2>
          </TitleContainer>
          <Title>LOVE</Title>
        </StyledLink>
      </LogoContainer>
      <Flex $gap={20} $align="center">
        <NavItem>튜토리얼</NavItem>
        <NavItem>나의 채팅방</NavItem>
        <NavItem>마이 페이지</NavItem>
        <div style={{ width: "30px" }}></div>
      </Flex>
    </Wrapper>
  );
}

const Wrapper = styled(motion.div)`
  width: 100%;
  height: inherit; /* 부모 컴포넌트에서 전달된 높이 상속 */
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  z-index: 10;

  /* 선 추가 */
  &::after {
    content: "";
    position: absolute;
    bottom: 0; /* TopBar의 하단에 위치 */
    left: 2.5%; /* 화면의 95% 가운데 정렬 */
    width: 95%; /* 선의 길이를 화면 가로의 95%로 설정 */
    height: 1px; /* 선의 두께 */
    background-color: #ff5a5a; /* 선의 색상 */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: column;
  margin-left: 30px;
  img {
    width: 100px;
    height: 62px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row; /* 텍스트를 한 줄로 정렬 */
  align-items: baseline; /* 기준선 정렬 */
  gap: 4px; /* 글자 간 간격 */
`;

const Title = styled.h2`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 24px;
  color: #ff5a5a;
  margin: 0;
  cursor: pointer;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #ffe0e0;
  }
`;

const Title2 = styled.h2`
  font-family: "Pretendard-Black", sans-serif;
  font-size: 24px;
  color: #ff5a5a;
  margin: 0;
  cursor: pointer;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #ffe0e0;
  }
`;

const NavItem = styled.h4`
  font-family: "Pretendard-Bold", sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #ff5a5a;
  margin: 0;
  cursor: pointer;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #ffe0e0;
  }
`;
