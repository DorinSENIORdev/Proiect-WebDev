import React from "react";

export default function EasySellIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="EasySell">
      <defs>
        <linearGradient id="bg" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="shine" x1="14" y1="10" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.45" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* App icon background */}
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#bg)" />

      {/* subtle shine */}
      <path
        d="M16 12C22 9 31 9 41 13C48 16 52 22 53 28C49 25 44 22 36 20C26 17 18 18 13 20C13 16 14 14 16 12Z"
        fill="url(#shine)"
      />

      {/* Shopping bag */}
      <g filter="url(#softShadow)">
        <path
          d="M20 28C20 24.7 22.7 22 26 22H38C41.3 22 44 24.7 44 28V44C44 47.3 41.3 50 38 50H26C22.7 50 20 47.3 20 44V28Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M26 24C26 20.7 28.7 18 32 18C35.3 18 38 20.7 38 24"
          stroke="#6D28D9"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Price tag overlay */}
        <path
          d="M36.5 30.5C36.5 29.1 37.6 28 39 28H45C46.1 28 47 28.9 47 30V36C47 37.1 46.1 38 45 38H41.7C41.2 38 40.7 37.8 40.4 37.4L37.1 34.1C36.7 33.7 36.5 33.2 36.5 32.7V30.5Z"
          fill="#A78BFA"
        />
        <circle cx="43.2" cy="31.7" r="1.6" fill="white" opacity="0.95" />

        {/* Spark */}
        <path d="M18 28L20 29L18 30L17 32L16 30L14 29L16 28L17 26L18 28Z" fill="white" opacity="0.9" />
        <path d="M48 42L50 43L48 44L47 46L46 44L44 43L46 42L47 40L48 42Z" fill="white" opacity="0.85" />
      </g>
    </svg>
  );
}
