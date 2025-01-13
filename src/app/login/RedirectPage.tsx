// NEXT_PUBLIC_KAKAO_CLIENT_ID=YOUR_KAKAO_REST_API_KEY
// NEXT_PUBLIC_REDIRECT_URI=http://localhost:5000/auth/kakao/callback
// NEXT_PUBLIC_API_URL=http://localhost:5000

/*
인가 코드를 받은 후 토큰을 요청하는 페이지
*/

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      // ✅ URL에서 인가 코드 추출 -> 토큰 요청에 사용용
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) {
        alert("인가 코드를 받지 못했습니다.");
        return;
      }

      try {
        // ✅ 백엔드에 인가 코드 전달 및 토큰 요청
        //             - 요청 시 필요한 정보:
        //              - **인가 코드** : code
        //              - **클라이언트 ID (API 키)**
        //              - **Redirect URI** : NEXT_PUBLIC_api_URI
        //             *** 백엔드 경로: /auth/kakao

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`,
          {
            // 의심~
            code: code,
          }
        );
        console.log("✅ 로그인 성공:", response.data);
        alert("로그인 성공!");
        router.push("/profile");
      } catch (error) {
        console.error("❌ 로그인 실패:", error);
        alert("로그인 실패.");
      }
    };

    fetchToken();
  }, [router]);

  return <div>카카오 로그인 처리 중...</div>;
}
