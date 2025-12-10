import { useState } from "react";

import axios from "axios";

const API_BASE = "http://localhost:7272";

export default function ProductCard({ item, idToken }) {
  const [liked, setLiked] = useState(false);
  const md = item?.metadata || {};

  const handleFavs = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    };



    let cleanIngreds = md.clean_ingreds;

    if (
      typeof cleanIngreds === "string" &&
      cleanIngreds.startsWith("[") &&
      cleanIngreds.endsWith("]")
    ) {
      cleanIngreds = cleanIngreds.replace(/'/g, '"');
    }

    const cleanIngredsArray = Array.isArray(cleanIngreds)
      ? cleanIngreds
      : JSON.parse(cleanIngreds);

    const data = {
      product_name: md.name,
      price: String(md.price),
      category: md.category,
      url: md.url,
      clean_ingreds: cleanIngredsArray,
    };

    console.log(`Item : ${item}`);
    console.log(`MetaData: ${md.clean_ingreds}`);
    try {
      if (liked) {
        const params = new URLSearchParams({
          product_name: md.name,
        });

        await axios.delete(`${API_BASE}/me/favorites?${params.toString()}`, {
          headers,
        });
        alert("Product Removed...");
      } else {
        await axios.post(`${API_BASE}/me/favorites`, data, { headers });
      }
      setLiked(!liked);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <a
      href={md.url || "#"}
      target="_blank"
      rel="noreferrer"
      className="relative block  rounded-2xl p-3 hover:shadow transition backdrop-blur-sm"
    >
      <button
        // onClick={(e) => {
        //   e.preventDefault();
        //   // setLiked(!liked);
        //   handleFavs()
        // }}
        onClick={handleFavs}
        className="absolute cursor-pointer top-2 right-2 text-xl"
      >
        {liked ? "💜" : "🤍"}
      </button>

      <div className="text-sm font-semibold text-black">
        {md.name || "Product"}
      </div>
      <div className="text-xs text-gray-600 mt-1">
        Type: {md.category || "-"}
      </div>

      {md.price !== undefined && (
        <div className="text-xs text-gray-800 mt-1">₹{String(md.price)}</div>
      )}

      {md.clean_ingreds && (
        <div className="text-xs text-gray-500 mt-2 line-clamp-3">
          {String(md.clean_ingreds).slice(0, 100)}
          {String(md.clean_ingreds).length > 100 ? "…" : ""}
        </div>
      )}

      <div className="text-xs mt-2 text-blue-600">Open link ↗</div>
    </a>
  );
}
