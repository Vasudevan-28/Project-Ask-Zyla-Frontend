import { useState } from "react";
import Thinking from "../gifs/thinking-zyla.gif"


export default function ZylaGif() {

  const [gifTime, setGifTime] = useState()

  const playGif = () => {
     setGifTime(Date.now());
  }

  return (
    <div className="w-full flex justify-start z-10">
      <div className="flex items-center gap-2 max-w-[80%] flex-row-reverse" >

          <img
            // src="src/assets/Zyla-no-bg.png"
            src= {`${Thinking}?ts=${gifTime}`}
            className="w-26 h-26"
            alt="Assistant"
            onMouseEnter={playGif}
          />
        

       
      </div>
    </div>
  );
}
