// Professional Shirt Icon - Clear Classic Design
const ShirtLogo = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shirt body */}
      <path
        d="M14 16L18 12H30L34 16V46H14V16Z"
        fill="#8B1E2D"
      />
      
      {/* Left sleeve */}
      <path
        d="M14 16L8 22V32L14 26V16Z"
        fill="#8B1E2D"
      />
      
      {/* Right sleeve */}
      <path
        d="M34 16L40 22V32L34 26V16Z"
        fill="#8B1E2D"
      />
      
      {/* Collar */}
      <path
        d="M14 16L18 12L24 16L30 12L34 16"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M18 12L24 6L30 12"
        fill="#8B1E2D"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Center placket */}
      <rect x="22" y="16" width="4" height="30" fill="#8B1E2D" />
      <line x1="24" y1="16" x2="24" y2="46" stroke="#FFFFFF" strokeWidth="1.5" />
      
      {/* Buttons */}
      <circle cx="24" cy="21" r="1.8" fill="#8B1E2D" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="24" cy="28" r="1.8" fill="#8B1E2D" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="24" cy="35" r="1.8" fill="#8B1E2D" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="24" cy="42" r="1.8" fill="#8B1E2D" stroke="#FFFFFF" strokeWidth="1.5" />
      
      {/* Left chest pocket */}
      <rect x="27" y="24" width="7" height="8" rx="1" fill="#8B1E2D" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  );
};

export default ShirtLogo;
