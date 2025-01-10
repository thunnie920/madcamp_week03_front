"use client";
import "../styles/globals.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => router.push("/about")}>Go to About</button>
    </div>
  );
}
