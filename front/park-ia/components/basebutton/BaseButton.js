import React from 'react';

export default function BaseButton({ 
  onClick, 
  children, 
  className = "py-2 px-4 bg-white border-2 border-black text-black rounded hover:bg-black hover:text-white"
}) {
  return (
    <button 
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
