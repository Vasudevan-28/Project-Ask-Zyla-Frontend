import React from "react";

function Privacy({ isOpen, onClose }) {
  if (!isOpen) return null; 

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          padding: "24px 28px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#7d195c",
            }}
          >
            Privacy Notice
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
              color: "#7d195c",
            }}
          >
          </button>
        </div>

        {/* Body */}
        <p
          style={{
            fontSize: "14px",
            marginBottom: "12px",
            color: "#4a0840",
            lineHeight: 1.5,
          }}
        >
          We collect only necessary user data
          <p>Which is securely stored in our database</p>
          <p> We dont share or sell your data</p>
          </p>

       

        {/* Footer button */}
        <div style={{ textAlign: "right" }}>
          {/* <button
            onClick={onClose}
            style={{
              padding: "8px 22px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              background:
                "linear-gradient(90deg, #7d195c 0%, #b54aa2 50%, #7d195c 100%)",
              color: "#ffffff",
              boxShadow: "0 4px 10px rgba(125,25,92,0.4)",
            }}
          >
            Got it
          </button> */}

          <button
  onClick={onClose}
  className="
    px-5 py-2
    rounded-md
    text-sm font-semibold tracking-wide uppercase
    text-white
    shadow-[0_4px_10px_rgba(125,25,92,0.4)]
    bg-linear-to-r from-[#994A97] to-[#CA88B1]
    hover:opacity-90
    transition-all duration-150
    cursor-pointer
  "
>
  Got it
</button>

        </div>
      </div>
    </div>
  );
}

export default Privacy;
