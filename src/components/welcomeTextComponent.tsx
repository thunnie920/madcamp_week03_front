"use client";

import { easeInOut, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Flex } from "@/src/libs/flex";
import Image from "next/image";
import Logo from "@/public/images/logo.png";

interface WelcomeTextProps {
  text: string;
}

export default function WelcomeText({ text }: WelcomeTextProps) {
  return (
    <Wrapper>
      <Title>{text}</Title>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction : row;
  justify-content: flex-direction;
  align-items: flex-start;
  position: relative;
  }
`;

const Title = styled.h1`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 24px;
  color: #353131;
  margin: 0;
  justify-content: center;
  }
`;
