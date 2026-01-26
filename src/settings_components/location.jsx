
import React, { useEffect, useRef } from "react";

export default function Location({ enabled, onLocationDetected }) {
  const API_KEY = import.meta.env.VITE_LOCATION_API;

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      fetchedRef.current = false; 
      return;
    }

    if (fetchedRef.current) return;

    if (!("geolocation" in navigator)) {
      if (typeof onLocationDetected === "function") {
        onLocationDetected({
          error: "Geolocation not supported in this browser",
        });
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`
          );

          if (!res.ok) throw new Error(`Geoapify error: ${res.status}`);

          const data = await res.json();
          const props = data?.features?.[0]?.properties || {};

          const location = {
            city: props.city || props.town || props.village || "N/A",
            state: props.state || "N/A",
            country: props.country || "N/A",
            postcode: props.postcode || "N/A",
            area: props.suburb || props.district || props.neighbourhood || "N/A",
            latitude,
            longitude,
          };

          fetchedRef.current = true; // mark as fetched
          if (typeof onLocationDetected === "function") {
            onLocationDetected(location);
          }
        } catch (err) {
          console.error("Failed to fetch location data", err);
          if (typeof onLocationDetected === "function") {
            onLocationDetected({
              error: "Failed to fetch location from Geoapify",
            });
          }
        }
      },
      (err) => {
        let msg;
        switch (err.code) {
          case 1:
            msg = "Permission denied. Check browser settings.";
            break;
          case 2:
            msg = "Position unavailable.";
            break;
          case 3:
            msg = "Timeout getting location.";
            break;
          default:
            msg = err.message || "Unknown geolocation error";
        }

        fetchedRef.current = true; 
        if (typeof onLocationDetected === "function") {
          onLocationDetected({ error: msg });
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, [enabled, onLocationDetected, API_KEY]);

  return null;
}
