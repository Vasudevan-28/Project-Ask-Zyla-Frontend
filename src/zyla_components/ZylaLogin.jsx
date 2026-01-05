import { useEffect, useState } from "react"
import CloudThink from "../gifs/cloud-loop.gif"
import TalkShake from "../gifs/talk-shake.gif"


export default function ZylaLogin(){
    const [loadGif, setLoadGif] = useState(false)
    const [showTextDelayed, setShowTextDelayed] = useState(false);

useEffect(() => {
  if(loadGif){
    setTimeout(() => setShowTextDelayed(true), 400); 
  } else {
    setShowTextDelayed(false);
  }
}, [loadGif]);

    const statements = [
      "Hi I am Zyla, I will remember you on this device unless you say otherwise."
    ];

    const [index, setIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setLoadGif(true);

    setTimeout(() => setLoadGif(false), 2000); 

    setIndex(prev => (prev + 1) % statements.length); 
  }, 3000); 

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
    )
}


