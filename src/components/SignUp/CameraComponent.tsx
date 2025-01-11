import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

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

  const screenshot = (): void => {
    setCanvasState(""); // Show canvas
    setCameraState("none"); // Hide video

    const video = videoRef.current;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(-1, 1); // Flip horizontally
        context.translate(-1024, 0);
        context.drawImage(video, 0, 0, 1024, 768);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "fileName.jpg", {
              type: "image/jpeg",
            });
            console.log("File created:", file);
          }
        }, "image/jpeg");

        const image = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = image;
        link.download = "PaintJS[🎨]";
        link.click();

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
