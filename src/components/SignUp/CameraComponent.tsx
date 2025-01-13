import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface CameraProps {
  onPhotoCaptured: (imageData: string) => void; // 캡처된 사진 데이터를 전달하는 콜백
}

export default function Camera({ onPhotoCaptured }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasState, setCanvasState] = useState<string>("none");
  const [cameraState, setCameraState] = useState<string>("");

  useEffect(() => {
    getWebcam((stream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const getWebcam = (callback: (stream: MediaStream) => void): void => {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
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
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        context.resetTransform(); // Reset any transformations
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      setCanvasState("none");
      setCameraState("");

      getWebcam((stream: MediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    }
  };

  const screenshot = (): void => {
    setCanvasState(""); // Show canvas
    setCameraState("none"); // Hide video

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "fileName.jpg", {
              type: "image/jpeg",
            });
            console.log("File created:", file);
          }
        }, "image/jpeg");

        const image = canvas.toDataURL("image/jpeg");
        onPhotoCaptured(image);
        const link = document.createElement("a");
        link.href = image;
        link.download = "photo.jpg";
        link.click();

        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    }
  };

  /*
  const screenshot = async (): Promise<void> => {
  setCanvasState(""); // Show canvas
  setCameraState("none"); // Hide video

  const video = videoRef.current;
  const canvas = canvasRef.current;

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
*/

  return (
    <Container>
      <Video
        ref={videoRef}
        autoPlay
        style={{
          display: cameraState,
          transform: "rotateY(180deg)",
        }}
      />
      <Canvas ref={canvasRef} style={{ display: canvasState }} />

      {canvasState === "none" ? (
        <StyledButton onClick={screenshot}>
          <InnerCircle />
        </StyledButton>
      ) : (
        <StyledButton onClick={goToCamera}>
          <p>다시 촬영</p>
        </StyledButton>
      )}
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%
  max-width: 640px; /* 최대 크기를 설정 */
  max-height: 640px;
  margin: 0 auto;
  background-color: white;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: auto;
`;

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
