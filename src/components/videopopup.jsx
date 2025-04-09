import { useState, useRef, useEffect } from "react";
import closebtn from "../assets/close.png";
import Webcam from "react-webcam";
import fullscreenIcon from "../assets/fullscreen.png";
import exitscreenIcon from "../assets/exitscreen.png";

const VideoPopup = ({ showPopup, onClose, onSuccess, onError }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const popupRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const lastPoseData = useRef(null);
  
  const smoothingFactor = 0.1;

  const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/image`;

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      popupRef.current?.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const smoothPoseData = (newPose) => {
    if (!lastPoseData.current) return newPose;
    return newPose.map((keypoint, index) => ({
      x:
        lastPoseData.current[index]?.x * (1 - smoothingFactor) +
        keypoint.x * smoothingFactor,
      y:
        lastPoseData.current[index]?.y * (1 - smoothingFactor) +
        keypoint.y * smoothingFactor,
    }));
  };

  const processFrame = async () => {
    if (!webcamRef.current || !canvasRef.current) return;

    try {
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        console.error("No image captured from webcam.");
        return;
      }

      const base64Image = imageSrc.split(",")[1];

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        console.error("API Response Error:", response.status);
        throw new Error("API response error");
      }

      const result = await response.json();

      if (result.keypoints) {
        lastPoseData.current = smoothPoseData(result.keypoints);

        context.beginPath();
        lastPoseData.current.forEach(({ x, y }) => {
          context.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
        });
        context.fillStyle = "red";
        context.fill();
      }

      onSuccess?.(result);
    } catch (error) {
      console.error("Pose detection error:", error);
      onError?.(error.message || "Pose detection failed");
    }
  };

  const startProcessing = () => {
    const loop = () => {
      processFrame();
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={popupRef}
        className={`${
          isFullscreen
            ? "w-full h-full m-0 rounded-none"
            : "w-[600px] h-[450px] rounded-md"
        } bg-white relative p-4 flex flex-col`}
      >
        <div className="absolute top-2 right-2 flex gap-2 z-50">
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 cursor-pointer hover:opacity-80 invert-100"
          >
            <img
              src={isFullscreen ? exitscreenIcon : fullscreenIcon}
              alt="Toggle fullscreen"
            />
          </button>
          <img
            src={closebtn}
            alt="Close"
            onClick={onClose}
            className="w-8 h-8 invert-100 cursor-pointer hover:opacity-80"
          />
        </div>

        {/* Video Container with Fullscreen Fix */}
        <div
          className={`relative flex-1 overflow-hidden rounded-md ${
            isFullscreen ? "w-full h-full" : "w-[500px] h-[400px]"
          }`}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="absolute inset-0 w-full h-full object-cover rounded-md"
            onUserMedia={startProcessing}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none", backgroundColor: "transparent" }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;


