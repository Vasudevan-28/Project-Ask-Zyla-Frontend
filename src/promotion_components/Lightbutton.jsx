import { useNavigate } from "react-router-dom";

function Lightbutton({ children}) {
  const navigate = useNavigate()

  // const openTab  = () => {
  //   window.open('/login', "_blank")
  // }

  return (
    <button
      onClick={() => {navigate('/TrialChat')}}
      className="
        relative inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl
        font-semibold text-white text-sm sm:text-base

        cursor-pointer
        
        /* base gradient */
        bg-linear-to-r from-[#71687e] to-[#4e3c63]

        border-transparent 
        bg-clip-padding 
        shadow-md

        /* animation controls */
        transform transition-all duration-300 ease-out

        /* hover effects */
        hover:scale-105
        hover:from-[#8a8197] hover:to-[#6a4d82]
        hover:shadow-xl
        hover:border-[#C9BAD9]

        /* before wrapper border glow */
        before:absolute before:inset-0 
        before:rounded-xl before:p-0.5
        before:bg-linear-to-r before:from-[#4e3c63] before:to-[#71687e]
        before:z-[-1]

        /* hover glow strength */
        hover:before:from-[#6a4d82]
        hover:before:to-[#8a8197]
      "
    >
      {children}
    </button>
  );
}

export default Lightbutton;
