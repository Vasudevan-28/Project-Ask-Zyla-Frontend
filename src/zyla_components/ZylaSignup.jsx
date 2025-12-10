import { useEffect, useState } from "react";
// import CloudThink from "../gifs/cloud-loop.gif";
import CloudThink from "../gifs/cloud-loop.gif";
import TalkShake from "../gifs/talk-shake.gif";

export default function ZylaSignup() {
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
    "Hi I’m Zyla. Let’s get to know each other.",
    "Create your account and I’ll start learning your skin, your routine and your glow goals.",
    "I’ll keep your info safe. I only use it to help your skin feel better."
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
  <div className="w-120 h-100 bg-transparent rounded-lg">
    <div className="relative h-full w-full">
      <div className="h-29 w-35 absolute bottom-7 right-16 left-11 bg-black rounded-full"></div>
      <img src={TalkShake} className="h-55 w-60 absolute bottom-0" />
      <img
        src={CloudThink}
        className={`h-44 w-90 absolute top-0 right-0
          transition-all duration-800 ease-in-out
          ${loadGif ? "opacity-100 scale-100" : "opacity-0 scale-0"}
        `}
      />
  <div>
      <p
      className={`absolute top-8 right-19 font-bold
           md:text-xl leading-tight
          max-w-[180px] md:max-w-[220px]    text-center  font-['Caveat']
          whitespace-normal wrap-break-word 
          transition-opacity duration-400 ease-in-out
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
