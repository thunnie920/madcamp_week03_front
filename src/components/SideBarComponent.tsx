"use client";

import { motion, useAnimation } from "framer-motion";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UnselectedRadioLogo from "@/public/images/unselectedRadio.png";
import SelectedRadioLogo from "@/public/images/selectedRadio.png";

type SideBarProps = {
  title: string;
  highlight?: string;
};

const filterData = {
  성격: [
    "다정한",
    "친절한",
    "외향적인",
    "내향적인",
    "귀여운",
    "과묵한",
    "어른스러운",
    "세심한",
  ],
  외모: [
    "키가 큰",
    "키가 작은",
    "고양이",
    "강아지",
    "두부",
    "아랍",
    "귀여운",
    "시크한",
    "장발",
    "단발",
  ],
  나이대: ["10대", "20대", "30대", "40대", "50대 이상"],
  관심사: [
    "운동",
    "영화 & 드라마",
    "음악",
    "요리",
    "독서",
    "게임",
    "여행",
    "맛집 탐방",
  ],
};

export default function SideBar({ title, highlight }: SideBarProps) {
  const pathname = usePathname();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSelection = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const filterEntries = Object.entries(filterData);

  const navControls = useAnimation();

  const navigationAnimation = useCallback(async () => {
    if (pathname === "/") {
      await navControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 1.2, ease: "easeInOut" },
      });
    }
  }, [navControls, pathname]);

  useEffect(() => {
    navigationAnimation();
  }, [navigationAnimation]);

  return (
    <Wrapper
      initial={
        pathname === "/" ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }
      }
      animate={pathname === "/" ? navControls : undefined}
    >
      <Title>
        {highlight ? (
          <span>
            <HighlightedText>{highlight}</HighlightedText> {title}
          </span>
        ) : (
          title
        )}
      </Title>

      {pathname === "/"
        ? filterEntries.map(([category, items], index) => (
            <FilterSection
              key={category}
              title={category}
              items={items}
              selectedFilters={selectedFilters}
              onSelect={handleSelection}
              showDivider={index !== filterEntries.length - 1}
            />
          ))
        : null}
    </Wrapper>
  );
}

type FilterSectionProps = {
  title: string;
  items: string[];
  selectedFilters: string[];
  onSelect: (item: string) => void;
  showDivider: boolean;
};

function FilterSection({
  title,
  items,
  selectedFilters,
  onSelect,
  showDivider,
}: FilterSectionProps) {
  return (
    <Section>
      <FilterTitle>{title}</FilterTitle>
      {items.map((item) => {
        const isSelected = selectedFilters.includes(item);
        return (
          <FilterItem
            key={item}
            onClick={() => onSelect(item)}
            $isSelected={isSelected}
          >
            <Image
              src={isSelected ? SelectedRadioLogo : UnselectedRadioLogo}
              alt="라디오 버튼"
              width={20}
              height={20}
            />
            <FilterText $isSelected={isSelected}>{item}</FilterText>
          </FilterItem>
        );
      })}
      {showDivider && <Divider />}
    </Section>
  );
}

const Wrapper = styled(motion.div)`
  width: 20%; /* 사이드바의 고정 너비 */
  max-width: 300px; /* 최대 너비 제한 */
  min-width: 200px; /* 최소 너비 보장 */
  flex-shrink: 0; /* 사이즈 축소 방지 */
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  padding: 10px;
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  border: 1px solid #ff5a5a;
`;

const Title = styled.h1`
  font-family: "Pretendard-Medium", sans-serif;
  font-size: 20px;
  color: #353131;
  margin-bottom: 20px;
  white-space: nowrap; /* 줄바꿈 방지 */
`;

const HighlightedText = styled.h1`
  font-family: "Pretendard-SemiBold", sans-serif;
  font-size: 20px;
  color: #ff5a5a;
  display: inline; /* 텍스트를 인라인으로 변경 */
  margin-bottom: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h2`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 16px;
  color: #353131;
  margin: 0 0 10px 0;
`;

const FilterItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "normal")};
`;

const FilterText = styled.span<{ $isSelected: boolean }>`
  font-family: "Pretendard-Regular", sans-serif;
  font-size: 14px;
  color: ${({ $isSelected }) => ($isSelected ? "#000" : "#353131")};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #ff5a5a;
  margin: 10px 0;
`;
