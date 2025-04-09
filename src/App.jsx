import { useState } from 'react';
import FileUploadForm from './components/uploadform';
import VideoPopup from './components/VideoPopup'; 

function App() {
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control the video pop-up

  const handleSuccess = (result) => {
    if (result.image) {
      setResultImage(`data:image/jpeg;base64,${result.image}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Pose Detection
        </h1>

        {/* File Upload Form */}
        <div className="w-full max-w-md">
          <FileUploadForm 
            onSuccess={handleSuccess}
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-md mt-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
            Error: {error}
          </div>
        )}

        {/* Result Image Display */}
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

        {/* Camera Button */}
        <button
          id="startCameraButton"
          onClick={() => setShowPopup(true)} // Open the video pop-up
          // onClick={()=> }
          className="mt-6 bg-[#4a5568] text-white px-6 py-3 rounded-lg hover:bg-[#2d3748] transition-colors"
        >
          Start Video
        </button>

        <VideoPopup showPopup={showPopup} onClose={()=>setShowPopup(false)}></VideoPopup>
      </div>

     
    </div>
  );
}

export default App;