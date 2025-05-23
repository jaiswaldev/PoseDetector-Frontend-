// import React, { forwardRef } from "react";
// import Webcam from "react-webcam";
// import closebtn from "../assets/close.png";

// const videoConstraints = {
//   width: 640,
//   height: 480,
//   facingMode: "user",
// };

// const VideoPopup = forwardRef(({ onClose, isStreaming, onReady }, ref) => {
//   const closeVideo = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div
//       onClick={closeVideo}
//       className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center"
//     >
//       <div className="w-[640px] h-[480px] relative">
//         <button onClick={onClose} className="absolute top-4 right-4 z-10">
//           <img
//             src={closebtn}
//             alt="Close"
//             className="w-8 h-8 invert cursor-pointer"
//           />
//         </button>

//         <Webcam
//           audio={false}
//           ref={ref}
//           screenshotFormat="image/jpeg"
//           videoConstraints={videoConstraints}
//           className="w-full h-full object-cover"
//           onUserMedia={onReady}
//         />

//         {isStreaming && (
//           <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
//             Streaming to server...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default VideoPopup;


import React from "react";
import closebtn from "../assets/close.png";

const VideoPopup = ({ onClose }) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:8000`;

  const handleClose = async () => {
    try {
      await fetch(`${BACKEND_URL}/stop_feed`);
      console.log("Stop signal sent to backend.");
    } catch (error) {
      console.error("Failed to stop stream:", error);
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="w-[640px] h-[480px] relative bg-black rounded shadow-lg overflow-hidden">
        <button onClick={handleClose} className="absolute top-4 right-4 z-10">
          <img
            src={closebtn}
            alt="Close"
            className="w-8 h-8 invert cursor-pointer"
          />
        </button>

        <img
          src={`${BACKEND_URL}/video_feed`}
          alt="Live pose detection"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default VideoPopup;
