import { useState, useEffect } from "react";
import "./App.scss";
import Cake from "./components/Cake";

function App() {
  const [elementPositions, setElementPositions] = useState([]);
  const [blowDetected, setBlowDetected] = useState(false);
  let audioContext;
  let analyser;
  let microphone;

  useEffect(() => {
    const initialPositions = Array.from({ length: 10 }, () => ({
      x: Math.random() * 230 + 10,
      y: Math.random() * 20,
    }));

    setElementPositions(initialPositions);
  }, []);

  useEffect(() => {
    const handleBlow = () => {
      setBlowDetected(true);

      if (microphone && analyser && audioContext.state === "running") {
        audioContext.suspend();
      }
    };

    const initializeMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const detectBlow = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

          if (average > 100 && !blowDetected) {
            handleBlow();
          }

          requestAnimationFrame(detectBlow);
        };

        detectBlow();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    initializeMicrophone();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [blowDetected]);

  return (
    <>
      <main style={{ backgroundColor: "maroon", minHeight: "100vh", width: "100vw", textAlign: "center", position: "absolute", top: 0, left: 0, fontFamily: "'Dancing Script', cursive" }}>
        <h1 style={{ fontSize: "3rem", color: "White", marginTop: "150px", fontFamily: "'Lobster', cursive", animation: "pulse 2s infinite alternate" }}>Happy Valentine's</h1>
        <Cake elementPositions={elementPositions} blowDetected={blowDetected} />
      </main>

      <footer style={{ textAlign: "center", padding: "10px", background: "#maroon", position: "absolute", bottom: 0, width: "100%", fontFamily: "'Dancing Script', cursive" }}>
        <p style={{ animation: "fadein 3s ease-in-out", color: "white" }}>
          Modified by Ruru &
          Credits to <a href="https://www.https://github.com/shoproizoshlo.com"> Sue Brechko</a> for the cake design.
        </p>
      </footer>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }

          @keyframes fadein {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
}

export default App;
