import { useEffect, useState } from "react";
import CloudThink from "../gifs/cloud-loop.gif";
import TalkGood from "../gifs/talkk-good.gif";

export default function ZylaPromotion() {
  const [loadGif, setLoadGif] = useState(false);
  const [showTextDelayed, setShowTextDelayed] = useState(false);

  useEffect(() => {
    if (loadGif) {
      setTimeout(() => setShowTextDelayed(true), 400); // Show text after cloud
    } else {
      setShowTextDelayed(false);
    }
  }, [loadGif]);

  const statements = [
    "Your skin told me it wants attention.Don’t worry, I’m already on it.",
    "I’m Zyla. I listen to your skin the way others listen to music.",
    "Come closer. Your skin has a story, and I’m here to rewrite it beautifully.",
  ];

  const [index, setIndex] = useState(0);

  // change text along with GIF timing
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadGif(true);

      setTimeout(() => setLoadGif(false), 3000); // cloud visible time

      setIndex((prev) => (prev + 1) % statements.length); // rotate 3 messages
    }, 4000); // GIF cycle time (adjust to GIF duration)

    return () => clearInterval(interval);
  }, []);

  const text = "Hi, I'm Zyla...";
  const [showText, setShowText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval1 = setInterval(() => {
      setLoadGif(true);
      setTimeout(() => setLoadGif(false), 7000);
    }, 8000);

    return () => clearInterval(interval1);
  });

  useEffect(() => {
    if (!isHovered) {
      setShowText("");
      return;
    }

    let ind = 0;
    const interval = setInterval(() => {
      setShowText(text.slice(0, ind + 1));
      ind++;

      if (ind == text.length) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div>
      <div className="w-106 h-100 bg-transparent rounded-lg">
        <div className="relative h-full w-full">
          <div className="h-35 w-35 absolute bottom-4 left-12 bg-black rounded-full"></div>
          <img src={TalkGood} className="h-56 w-56 absolute bottom-0" />
          <img
            src={CloudThink}
            className={`h-44 w-90 absolute top-0 right-0
        transition-all duration-800 ease-in-out
        ${loadGif ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
          />
          <div>
            <p
              className={`absolute top-6 right-19 
        font-semibold  md:text-xl leading-tight
        max-w-[180px] md:max-w-[220px]  font-['Caveat']
        whitespace-normal wrap-break-word text-center
        transition-opacity duration-800 ease-in-out
        ${showTextDelayed ? "opacity-100" : "opacity-0"}
      `}
            >
              {statements[index]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
