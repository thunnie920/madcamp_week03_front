/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // styled-components를 Next.js에서 사용할 수 있도록 활성화
  },
  env: {
    NEXT_PUBLIC_KAKAO_CLIENT_ID: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
    NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
}
};

module.exports = nextConfig;
