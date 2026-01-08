import { useEffect, useState } from "react"
// import CloudThink from "../gifs/new-cloud.png"
import CloudThink from "../gifs/cloud-loop.gif"
import Gif6 from "../assets/video3.gif"

export default function ZylaNewPassword(){
    const [loadGif, setLoadGif] = useState(false)
    const [showTextDelayed, setShowTextDelayed] = useState(false);

useEffect(() => {
  if(loadGif){
    setTimeout(() => setShowTextDelayed(true), 400); // Show text after cloud
  } else {
    setShowTextDelayed(false);
  }
}, [loadGif]);

    const statements = [
      "Let’s get you a new password."
    ];

    const [index, setIndex] = useState(0);

// change text along with GIF timing
useEffect(() => {
  const interval = setInterval(() => {
    setLoadGif(true);

    setTimeout(() => setLoadGif(false), 2000); // cloud visible time

    setIndex(prev => (prev + 1) % statements.length); // rotate 3 messages
  }, 3000); // GIF cycle time (adjust to GIF duration)

  return () => clearInterval(interval);
}, []);


    const text = "Hi, I'm Zyla..."
    const [showText, setShowText] = useState("")
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const interval1 = setInterval(() => {
                setLoadGif(true)
                setTimeout(() => setLoadGif(false), 4000)
            }, 5000)

        return () => clearInterval(interval1)
    })

    useEffect(() => {
        if(!isHovered){
            setShowText("")
            return
        }

        let ind = 0
        const interval = setInterval(() => {
            setShowText(text.slice(0, ind + 1))
            ind++

            if(ind == text.length){
                clearInterval(interval)
            }
        }, 200)

        return () => clearInterval(interval)
    }, [isHovered])



return (
    <div>          
   <div className="w-140 h-120 bg-transparent rounded-lg">
     <div className="relative h-full w-full">
       <div className="h-29 w-30 absolute bottom-20 right-12 left-28 bg-black rounded-full"></div>
       <img src={Gif6} className="h-80 w-86 absolute bottom-0" />
       <img
         src={CloudThink}
         className={`h-44 w-90 absolute top-0 right-2
           transition-all duration-800 ease-in-out
           ${loadGif ? "opacity-100 scale-100" : "opacity-0 scale-0"}
         `}
       />
   <div>
       <p
       className={`absolute top-12 right-21 font-bold
            text-xl leading-tight
           max-w-[220px]    text-center  font-['Caveat']
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


