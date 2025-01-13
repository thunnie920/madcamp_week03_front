import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Profile1 from "@/public/images/people/profile_1.jpg";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canvasState, setCanvasState] = useState<string>("none");
  const [cameraState, setCameraState] = useState<string>("");

  useEffect(() => {
    getWebcam((stream: MediaStream) => {
      if (videoRef.current) {
        (
          videoRef.current as HTMLVideoElement & { srcObject: MediaStream }
        ).srcObject = stream;
      }
    });
  }, []);

  const getWebcam = (callback: (stream: MediaStream) => void): void => {
    const constraints = {
      video: true,
      audio: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(callback)
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
      });
  };

  const goToCamera = (): void => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(-1, 1); // Flip horizontally
        context.translate(-1024, 0);
        context.drawImage(video, 0, 0, 1024, 768);
      }
      setCanvasState("none");
      setCameraState("");

      getWebcam((stream: MediaStream) => {
        if (videoRef.current) {
          (
            videoRef.current as HTMLVideoElement & { srcObject: MediaStream }
          ).srcObject = stream;
        }
      });
    }
  };

  const screenshot = async (): Promise<void> => {
    setCanvasState(""); // Show canvas
    setCameraState("none"); // Hide video

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const uploadedImage = Profile1;  // 사용자가 업로드한 프로필 이미지

    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 이미지 데이터를 Blob으로 변환
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Blob을 FormData에 추가
            const formData = new FormData();
            formData.append("image", blob, "photo.jpg");
            formData.append("images", uploadedImage.src, "profile.jpg");

            try {
              // 백엔드 API 호출
              const response = await fetch("https://your-backend-url.com/api/similarity-check", {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                throw new Error("Failed to send image to the server");
              }

              const result = await response.json();
              console.log("Similarity check result:", result);

              // 결과 처리 로직 추가
              alert(`Similarity score: ${result.score}`);
            } catch (error) {
              console.error("Error during similarity check:", error);
              alert("Error sending image to the server.");
            }
          }
        }, "image/jpeg");

        // 비디오 스트림 종료
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    }
  };
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 100,
        width: "1024px",
        backgroundColor: "white",
      }}
    >
      <video
        id="videoCam"
        ref={videoRef}
        autoPlay
        style={{
          display: cameraState,
          width: "100%",
          height: "auto",
          transform: "rotateY(180deg)",
        }}
      />

      <canvas
        id="canvas"
        width={1024}
        height={768}
        style={{
          display: canvasState,
          width: "100%",
          height: "auto",
        }}
      ></canvas>

      {canvasState === "none" ? (
        <StyledButton onClick={screenshot}>
          <InnerCircle />
        </StyledButton>
      ) : (
        <StyledButton onClick={goToCamera}>
          <p>다시 촬영</p>
        </StyledButton>
      )}
    </div>
  );
}

const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  margin: 10px;
  border-radius: 50%;
  position: absolute;
  z-index: 101;
  bottom: 5%;
  left: 46%;
  cursor: pointer;
  background-color: white;
`;

const InnerCircle = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid;
  border-radius: 50%;
`;
