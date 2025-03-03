import React from "react";

export const KmrLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Circle with Gradient */}
    <defs>
      <linearGradient id="kmrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-primary" stopOpacity="0.1">
          <animate
            attributeName="stop-opacity"
            values="0.1;0.3;0.1"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" className="stop-primary" stopOpacity="0.3">
          <animate
            attributeName="stop-opacity"
            values="0.3;0.5;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      {/* Animated Dash Array */}
      <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" className="stop-primary" stopOpacity="0.3">
          <animate
            attributeName="offset"
            values="0;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" className="stop-primary" stopOpacity="1">
          <animate
            attributeName="offset"
            values="1;2"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>

    {/* Base Circle */}
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#kmrGradient)"
      className="stroke-primary"
      strokeWidth="2"
    >
      <animate
        attributeName="r"
        values="45;47;45"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Animated Border */}
    <circle
      cx="50"
      cy="50"
      r="45"
      className="stroke-primary"
      strokeWidth="3"
      strokeDasharray="6 3"
      fill="none"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="8s"
        repeatCount="indefinite"
      />
    </circle>

    {/* KMR Letters with Dynamic Strokes */}
    <path
      d="M30 30H35V70H30V30Z"
      className="fill-primary"
      strokeWidth="1"
    >
      <animate
        attributeName="d"
        values="M30 30H35V70H30V30Z;M28 30H33V70H28V30Z;M30 30H35V70H30V30Z"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>

    <path
      d="M35 50L45 30H50L40 50L50 70H45L35 50Z"
      className="fill-primary"
      strokeWidth="1"
    >
      <animate
        attributeName="opacity"
        values="1;0.8;1"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>

    <path
      d="M55 30H60V70H55V30Z"
      className="fill-primary"
      strokeWidth="1"
    >
      <animate
        attributeName="d"
        values="M55 30H60V70H55V30Z;M57 30H62V70H57V30Z;M55 30H60V70H55V30Z"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>

    {/* Pulsing Dots */}
    <circle cx="30" cy="30" r="2" className="fill-primary">
      <animate
        attributeName="r"
        values="2;3;2"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="30" r="2" className="fill-primary">
      <animate
        attributeName="r"
        values="2;3;2"
        dur="1s"
        repeatCount="indefinite"
        begin="0.3s"
      />
    </circle>
    <circle cx="45" cy="50" r="2" className="fill-primary">
      <animate
        attributeName="r"
        values="2;3;2"
        dur="1s"
        repeatCount="indefinite"
        begin="0.6s"
      />
    </circle>
  </svg>
);