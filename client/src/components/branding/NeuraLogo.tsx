import React from "react";

export const NeuraLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Neural Network Gradient */}
      <linearGradient id="neuraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-primary" stopOpacity="0.1">
          <animate
            attributeName="stop-opacity"
            values="0.1;0.3;0.1"
            dur="3s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" className="stop-primary" stopOpacity="0.3">
          <animate
            attributeName="stop-opacity"
            values="0.3;0.5;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      {/* Connection Line Gradient */}
      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" className="stop-primary" stopOpacity="0.2" />
        <stop offset="50%" className="stop-primary" stopOpacity="0.8" />
        <stop offset="100%" className="stop-primary" stopOpacity="0.2" />
        <animateTransform
          attributeName="gradientTransform"
          type="translate"
          from="-1"
          to="1"
          dur="2s"
          repeatCount="indefinite"
        />
      </linearGradient>
    </defs>

    {/* Background Circles */}
    <circle cx="50" cy="50" r="45" fill="url(#neuraGradient)" />
    <circle
      cx="50"
      cy="50"
      r="40"
      className="stroke-primary"
      strokeWidth="0.5"
      fill="none"
    >
      <animate
        attributeName="r"
        values="40;42;40"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Neural Network Nodes */}
    <g id="neural-nodes">
      {/* Center Node */}
      <circle cx="50" cy="50" r="4" className="fill-primary">
        <animate
          attributeName="r"
          values="4;5;4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Outer Nodes */}
      <circle cx="30" cy="30" r="3" className="fill-primary">
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </circle>
      <circle cx="70" cy="30" r="3" className="fill-primary">
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          repeatCount="indefinite"
          begin="0.4s"
        />
      </circle>
      <circle cx="30" cy="70" r="3" className="fill-primary">
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </circle>
      <circle cx="70" cy="70" r="3" className="fill-primary">
        <animate
          attributeName="r"
          values="3;4;3"
          dur="2s"
          repeatCount="indefinite"
          begin="0.8s"
        />
      </circle>
    </g>

    {/* Neural Connections */}
    <g id="neural-connections" className="stroke-primary" strokeWidth="1">
      <path d="M50 50L30 30">
        <animate
          attributeName="stroke-dasharray"
          values="0,28;28,0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M50 50L70 30">
        <animate
          attributeName="stroke-dasharray"
          values="0,28;28,0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </path>
      <path d="M50 50L30 70">
        <animate
          attributeName="stroke-dasharray"
          values="0,28;28,0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.4s"
        />
      </path>
      <path d="M50 50L70 70">
        <animate
          attributeName="stroke-dasharray"
          values="0,28;28,0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </path>
    </g>

    {/* NC Symbol */}
    <g id="nc-symbol" className="fill-primary">
      <text
        x="50"
        y="52"
        textAnchor="middle"
        className="text-[14px] font-bold"
        dominantBaseline="middle"
      >
        NC
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="2s"
          repeatCount="indefinite"
        />
      </text>
    </g>

    {/* Outer Ring */}
    <circle
      cx="50"
      cy="50"
      r="45"
      className="stroke-primary"
      strokeWidth="2"
      fill="none"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0,283;283,0"
        dur="10s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);