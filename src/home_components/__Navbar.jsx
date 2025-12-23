import "./App.css";
import profilepic from "./assets/Zyla-DP.png";

function Navbar(){
    return (
        <>
        <div className="h-1.5 bg-[rgba(233,217,227,1)]"/>

        <nav className="flex justify-between items-center p-1.5 bg-white text-[rgba(153,74,151,1)] shadow-md">
            <img src={profilepic} alt="Profile"
        className="w-12 h-12 rounded-full border-2 border-[rgba(233,217,227,1)] cursor-pointer hover:scale-105 transition"/>
            <h3 className="text-2xl font-bold italic px-2 py-0">Ask Zyla</h3>
            
            <div className="flex-1 flex justify-center">
            {/*<ul className="flex gap-6 text-lg">
                <li>Chatbot</li>
                <li>Skin Profile</li>
                <li>Product</li>
                <li>About us</li>
            </ul>*/}
            </div>
            
        </nav>
        </>
    );
}
export default Navbar;