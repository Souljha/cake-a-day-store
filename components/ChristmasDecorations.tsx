import React from 'react';

const ChristmasDecorations: React.FC = () => {
  return (
    <>
      {/* Christmas Tree - Left Corner */}
      <div className="fixed bottom-0 left-0 z-10 hidden lg:block opacity-80">
        <svg width="150" height="200" viewBox="0 0 150 200" className="drop-shadow-lg">
          {/* Tree */}
          <polygon points="75,20 40,80 110,80" fill="#2d5016" />
          <polygon points="75,60 35,120 115,120" fill="#3a6b1f" />
          <polygon points="75,100 30,160 120,160" fill="#4a8028" />
          {/* Trunk */}
          <rect x="65" y="160" width="20" height="40" fill="#5c4033" />
          {/* Star on top */}
          <polygon points="75,10 77,18 85,18 79,23 81,31 75,26 69,31 71,23 65,18 73,18" fill="#ffd700" />
          {/* Ornaments */}
          <circle cx="60" cy="85" r="4" fill="#ff0000" />
          <circle cx="90" cy="90" r="4" fill="#ffd700" />
          <circle cx="55" cy="125" r="4" fill="#0066cc" />
          <circle cx="95" cy="130" r="4" fill="#ff0000" />
          <circle cx="75" cy="145" r="4" fill="#ffd700" />
        </svg>
      </div>

      {/* Christmas Tree - Right Corner */}
      <div className="fixed bottom-0 right-0 z-10 hidden lg:block opacity-80">
        <svg width="150" height="200" viewBox="0 0 150 200" className="drop-shadow-lg">
          {/* Tree */}
          <polygon points="75,20 40,80 110,80" fill="#2d5016" />
          <polygon points="75,60 35,120 115,120" fill="#3a6b1f" />
          <polygon points="75,100 30,160 120,160" fill="#4a8028" />
          {/* Trunk */}
          <rect x="65" y="160" width="20" height="40" fill="#5c4033" />
          {/* Star on top */}
          <polygon points="75,10 77,18 85,18 79,23 81,31 75,26 69,31 71,23 65,18 73,18" fill="#ffd700" />
          {/* Ornaments */}
          <circle cx="60" cy="85" r="4" fill="#0066cc" />
          <circle cx="90" cy="90" r="4" fill="#ff0000" />
          <circle cx="55" cy="125" r="4" fill="#ffd700" />
          <circle cx="95" cy="130" r="4" fill="#0066cc" />
          <circle cx="75" cy="145" r="4" fill="#ff0000" />
        </svg>
      </div>

      {/* Hanging Ornaments - Top of page */}
      <div className="fixed top-0 left-0 w-full z-10 pointer-events-none">
        <div className="flex justify-around px-4 md:px-20 pt-20">
          {/* Ornament 1 */}
          <div className="animate-swing" style={{ animationDelay: '0s' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#666" strokeWidth="1" />
              <circle cx="20" cy="25" r="10" fill="#ff0000" opacity="0.9" />
              <circle cx="20" cy="25" r="8" fill="#ff4444" opacity="0.7" />
              <rect x="18" y="15" width="4" height="5" fill="#ffd700" />
            </svg>
          </div>

          {/* Ornament 2 */}
          <div className="animate-swing" style={{ animationDelay: '0.5s' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#666" strokeWidth="1" />
              <circle cx="20" cy="25" r="10" fill="#ffd700" opacity="0.9" />
              <circle cx="20" cy="25" r="8" fill="#ffeb3b" opacity="0.7" />
              <rect x="18" y="15" width="4" height="5" fill="#ff0000" />
            </svg>
          </div>

          {/* Ornament 3 */}
          <div className="animate-swing hidden md:block" style={{ animationDelay: '1s' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#666" strokeWidth="1" />
              <circle cx="20" cy="25" r="10" fill="#0066cc" opacity="0.9" />
              <circle cx="20" cy="25" r="8" fill="#4488ff" opacity="0.7" />
              <rect x="18" y="15" width="4" height="5" fill="#ffd700" />
            </svg>
          </div>

          {/* Ornament 4 */}
          <div className="animate-swing hidden md:block" style={{ animationDelay: '1.5s' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#666" strokeWidth="1" />
              <circle cx="20" cy="25" r="10" fill="#00aa00" opacity="0.9" />
              <circle cx="20" cy="25" r="8" fill="#44dd44" opacity="0.7" />
              <rect x="18" y="15" width="4" height="5" fill="#ff0000" />
            </svg>
          </div>

          {/* Ornament 5 */}
          <div className="animate-swing" style={{ animationDelay: '2s' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#666" strokeWidth="1" />
              <circle cx="20" cy="25" r="10" fill="#ff0000" opacity="0.9" />
              <circle cx="20" cy="25" r="8" fill="#ff4444" opacity="0.7" />
              <rect x="18" y="15" width="4" height="5" fill="#ffd700" />
            </svg>
          </div>
        </div>
      </div>

      {/* CSS for swing animation */}
      <style>{`
        @keyframes swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </>
  );
};

export default ChristmasDecorations;
