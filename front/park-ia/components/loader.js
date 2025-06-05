import React from 'react'

function Loader() {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="relative">
        {/* Cercle extérieur avec effet glassmorphisme */}
        <div className="w-24 h-24 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg animate-spin">
          {/* Cercle intérieur avec effet glassmorphisme */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg animate-spin-reverse">
            {/* Point central avec effet glassmorphisme */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg animate-pulse">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader