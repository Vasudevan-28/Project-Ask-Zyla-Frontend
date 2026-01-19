import { useContext } from "react";
import NormPurf from "../gifs/norm-purf.gif"
import { ThemeContext } from "../contexts/ThemeContext";


export default function AIDescription({zylaSum}) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
//   const points =
//     "1. Delicate\n2. Sensitive\n3. Visible\n4. Thinner\n5. Regenerates";

//   const genDes = "1. You have combination skin that's sensitive to fragrance and essential oils, making you prone to allergies.\n2. Your skin concerns include acne, dark spots, dryness, dullness, aging, and oily skin, which can be challenging to manage.\n3. You follow a daily skincare routine, which is great for maintaining healthy skin.\n4. You experience occasional redness and irritation, and your skin gets oily during your menstrual cycle, although you mentioned you don't have one.\n5. Your skincare goals are to achieve clearer skin, a brighter glow, smoother texture, and anti-aging, which we can work towards with a customized routine."

  const genDesArray = zylaSum.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""))

  return (
    <div className="lg:col-span-4">
      <div className={` h-fit mb-4  ${isLight ? "bg-white/60" : "bg-white/10" }  h-[calc(100vh-8rem)]  rounded-2xl shadow-2xl p-5 lg:p-6 sticky top-4 text-white min-h-72`}>

        <h2 className={`font-medium text-center mb-4 text-xl  lg:text-2xl 
           ${isLight ? "text-black" : "text-slate-50" }
          `}>
          Skin Description By Zyla
        </h2>

        <div className={` border  border-white/10 w-full rounded-xl p-4 h-fit flex flex-col justify-between
           ${isLight ? "text-slate-800 bg-white/80" : "text-slate-50 bg-white/10" }
          `}>
  {(!zylaSum || zylaSum.trim() === "") ? (
    <div className="flex justify-center py-10">
      <div className="loader border-t-transparent border-white/60"></div>
    </div>
  ) : (
    <div className="space-y-2 pr-1">
      {genDesArray.map((point, index) => (
        <div key={index} className="flex items-start gap-3 text-sm lg:text-[15px]">
          <span className={`shrink-0 w-6 h-6 rounded-full  flex items-center justify-center text-xs font-semibold
             ${isLight ? "bg-black/10" : "bg-black/20" }
            `}>
            {index + 1}
          </span>
          <p className={`leading-snug 
            ${isLight ? "text-slate-800" : "text-slate-50" }
            `}>{point}</p>
        </div>
      ))}
    </div>
  )}
</div>


        <div className="w-full h-44 flex justify-center mt-6 relative rounded-lg " >
            <div className="w-20 h-20 bg-black absolute top-14" ></div>
            <img className="w-44 h-40 absolute" src={NormPurf} alt="" />
        </div>
      </div>
    </div>
  );
}
