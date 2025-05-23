// import { useState, useRef, useEffect } from "react";
// import FileUploadForm from "./components/uploadform.jsx";
// import VideoPopup from "./components/videopopup.jsx";

// function App() {
//   const [resultImage, setResultImage] = useState(null);
//   const [poseData, setPoseData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [isStreaming, setIsStreaming] = useState(false);

//   const webcamRef = useRef(null);
//   const intervalId = useRef(null);

//   const BACKEND_URL =
//     import.meta.env.VITE_BACKEND_URL ||
//     `http://${window.location.hostname}:8000`;

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (intervalId.current) clearInterval(intervalId.current);
//     };
//   }, []);

//   const handleSuccess = (result) => {
//     if (result.image) {
//       setResultImage(`data:image/jpeg;base64,${result.image}`);
//     }
//     if (result.landmarks) {
//       setPoseData(result.landmarks);
//       console.log("Pose detected with landmarks:", result.landmarks.length);
//     }
//   };

//   const handleVideoSuccess = (result) => {
//     if (result.landmarks) {
//       setPoseData(result.landmarks);
//       console.log(
//         "Video pose detected with landmarks:",
//         result.landmarks.length
//       );
//     }
//   };

//   function dataURLtoBlob(dataurl) {
//     const arr = dataurl.split(",");
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) u8arr[n] = bstr.charCodeAt(n);
//     return new Blob([u8arr], { type: mime });
//   }

//   const captureAndSendFrame = async () => {
//     if (
//       !webcamRef.current ||
//       typeof webcamRef.current.getScreenshot !== "function"
//     )
//       return;

//     try {
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (!imageSrc) return;

//       const blob = dataURLtoBlob(imageSrc);

//       const formData = new FormData();
//       formData.append("file", blob, `frame_${Date.now()}.jpg`);

//       const response = await fetch(`${BACKEND_URL}/video_feed`, {
//         method: "POST",
//         body: formData,
//       });
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Frame uploaded:", data);
//     } catch (error) {
//       console.error("Error uploading frame:", error);
//       setError("Frame upload failed");
//     }
//   };

//   const startSendingFrames = () => {
//     setIsStreaming(true);
//     intervalId.current = setInterval(captureAndSendFrame, 100);
//   };

//   const stopSendingFrames = () => {
//     setIsStreaming(false);
//     if (intervalId.current) {
//       clearInterval(intervalId.current);
//       intervalId.current = null;
//     }
//   };

//   const handleStartVideo = () => {
//     setShowPopup(true); // Show the video popup
//   };

//   const handleWebcamReady = () => {
//     console.log("Webcam is ready.");
//     startSendingFrames(); // Start sending frames only when webcam is ready
//   };

//   const handleCloseVideo = () => {
//     setShowPopup(false);
//     stopSendingFrames();
//     setError(null);
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">
//           Pose Detection
//         </h1>

//         <div className="w-full max-w-md">
//           <FileUploadForm
//             onSuccess={handleSuccess}
//             onError={setError}
//             loading={loading}
//             setLoading={setLoading}
//           />
//         </div>

//         {error && (
//           <div className="w-full max-w-md mt-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
//             Error: {error}
//           </div>
//         )}

//         {resultImage && (
//           <div className="mt-8 w-full max-w-[400px] flex flex-col items-center">
//             <h3 className="text-xl font-semibold mb-4">Result:</h3>
//             <img
//               src={resultImage}
//               alt="Pose detection result"
//               className="w-full h-auto rounded-lg shadow-lg"
//             />
//           </div>
//         )}

//         {poseData && poseData.length > 0 && (
//           <div className="mt-4 w-full max-w-md p-3 bg-green-100 text-green-800 rounded-lg">
//             <p>Pose detected with {poseData.length} landmarks</p>
//           </div>
//         )}

//         <button
//           onClick={handleStartVideo}
//           className="mt-6 bg-[#4a5568] text-white px-6 py-3 rounded-lg hover:bg-[#2d3748] transition-colors"
//           disabled={isStreaming}
//         >
//           {isStreaming ? "Streaming..." : "Start Video"}
//         </button>

//         {showPopup && (
//           <VideoPopup
//             ref={webcamRef}
//             onClose={handleCloseVideo}
//             isStreaming={isStreaming}
//             onReady={handleWebcamReady}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


import { useState } from "react";
import FileUploadForm from "./components/uploadform.jsx";
import VideoPopup from "./components/videopopup.jsx";

function App() {
  const [resultImage, setResultImage] = useState(null);
  const [poseData, setPoseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSuccess = (result) => {
    if (result.image) {
      setResultImage(`data:image/jpeg;base64,${result.image}`);
    }
    if (result.landmarks) {
      setPoseData(result.landmarks);
      console.log("Pose detected with landmarks:", result.landmarks.length);
    }
  };

  const handleStartVideo = () => {
    setShowPopup(true);
  };

  const handleCloseVideo = () => {
    setShowPopup(false);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Pose Detection</h1>

        <div className="w-full max-w-md">
          <FileUploadForm
            onSuccess={handleSuccess}
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        {error && (
          <div className="w-full max-w-md mt-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
            Error: {error}
          </div>
        )}

        {resultImage && (
          <div className="mt-8 w-full max-w-[400px] flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Result:</h3>
            <img
              src={resultImage}
              alt="Pose detection result"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {poseData && poseData.length > 0 && (
          <div className="mt-4 w-full max-w-md p-3 bg-green-100 text-green-800 rounded-lg">
            <p>Pose detected with {poseData.length} landmarks</p>
          </div>
        )}

        <button
          onClick={handleStartVideo}
          className="mt-6 bg-[#4a5568] text-white px-6 py-3 rounded-lg hover:bg-[#2d3748] transition-colors"
        >
          Start Video
        </button>

        {showPopup && <VideoPopup onClose={handleCloseVideo} />}
      </div>
    </div>
  );
}

export default App;
