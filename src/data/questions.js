import video1 from "../assets/video1.gif";
import video2 from "../assets/video2.gif";
import video3 from "../assets/video3.gif";
import video4 from "../assets/video4.gif";
import video5 from "../assets/video5.gif";
import video6 from "../assets/video6.gif";
import video7 from "../assets/video7.gif";


export const questions = [
    {
      id: 1,
      question: "Choose your most important concern?",
      image: video1,
      type: "normal",
      options: [
        { id: 1, title: "Acne / Pimples", text: "Breakouts, whiteheads, or blackheads appearing frequently on the face." },
        { id: 2, title: "Dryness", text: "Skin feels tight, rough, or flaky — especially after washing." },
        { id: 3, title: "Oily Skin", text: "Face looks shiny or greasy, mainly around the nose and forehead." },
        { id: 4, title: "Dark Spots / Pigmentation", text: "Uneven skin tone or dark patches left after acne or sun exposure." },
        { id: 5, title: "Aging / Fine Lines", text: "Visible wrinkles, sagging skin, or loss of elasticity over time." },
        { id: 6, title: "Dullness / Uneven Tone", text: "Skin looks tired or lacks glow, with uneven color or texture." }
      ]
    },
    {
      id: 2,
      question: "What Is Your Skin Type?",
      image: video2,
      type: "normal",
      options: [
        { id: 1, title: "Oily", text: "Skin often looks shiny and may feel greasy." },
        { id: 2, title: "Dry", text: "Feels tight, rough, or flaky — lacks natural moisture." },
        { id: 3, title: "Combination", text: "Oily in some areas (T-zone) and dry or normal on the cheeks." },
        { id: 4, title: "Sensitive", text: "Easily irritated, turns red, or reacts to new products." },
        { id: 5, title: "Normal", text: "Balanced — not too oily or dry, feels smooth and healthy." },
        { id: 6, title: "Not sure", text: "You’re unsure of your skin type or it changes often." }
      ]
    },
    {
      id: 3,
      question: "How Often Do You Follow a Skincare Routine?",
      image: video3,
      type: "normal",
      options: [
        { id: 1, title: "Every day", text: "I follow my skincare steps regularly, both morning and night." },
        { id: 2, title: "Rarely", text: "Only when my skin feels dry or when I remember." },
        { id: 3, title: "Sometimes", text: "I do skincare on some days, but not consistently." },
        { id: 4, title: "Never", text: "I don’t follow any skincare routine yet" }
      ]
    },
    {
      id: 4,
      question: "What Result Do You Want to Achieve with Skincare?",
      image: video4,
      type: "normal",
      options: [
        { id: 1, title: "Clearer Skin", text: "Reduce dark spots, marks, and uneven tone for a clean look." },
        { id: 2, title: "Smoother Texture", text: "Make skin soft, even, and free from roughness." },
        { id: 3, title: "Brighter Glow", text: "Get a healthy, radiant, and refreshed appearance." },
        { id: 4, title: "Anti-Aging Benefits", text: "Minimize fine lines and wrinkles for youthful-looking skin." },
        { id: 5, title: "Fewer Pimples", text: "Control acne, prevent new breakouts, and fade scars." }
      ]
    },
    {
      id: 5,
      question: "Do you have any allergies?",
      image: video5,
      type: "normal",
      hasTextbox: true,
      options: [
        { id: 1, title: "Yes" },
        { id: 2, title: "No" }
      ]
    },
    {
      id: 6,
      type: "cycle",
      question: "Would you like us to personalize your skincare based on your menstrual cycle?",
      image: video6,
      options: [
        {
          subq: "1. When does your next menstrual cycle usually start?",
          opts: [
            "In the next few days",
            "Next week",
            "2+ Weeks Later",
            "Not regular",
            "Not sure"
          ]
        },
        {
          subq: "2. During your periods, how does your skin usually behave?",
          opts: [
            "Becomes more sensitive",
            "Gets oily",
            "Slight acne",
            "No major change",
            "Not sure"
          ]
        },
        {
          subq: "3. Would you like special skincare reminders during your cycle?",
          opts: [
            "Yes, send me reminders",
            "No, I’m okay"
          ]
        }
      ]
    },
    {
      id: 7,
      type: "symptoms",
      question: "Please share any other symptoms or details we might have missed!",
      image: video7,
      hasTextbox: true,
      options: [
        { id: 1, title: "Yes" },
        { id: 2, title: "No" }
      ]
    }
  ];
