"use client";

import { useEffect, useState, useRef } from 'react';

const GlowCard = ({ children, identifier }) => {
  const [activeStyles, setActiveStyles] = useState([]);
  const [angle, setAngle] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const handlePointerMove = (event) => {
      const updatedStyles = [];
      const container = containerRef.current;

      if (!container) return;

      const cards = container.querySelectorAll('.glow-card');

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        const inRange =
          event?.x > rect.left - CONFIG.proximity &&
          event?.x < rect.left + rect.width + CONFIG.proximity &&
          event?.y > rect.top - CONFIG.proximity &&
          event?.y < rect.top + rect.height + CONFIG.proximity;

        updatedStyles.push({
          id: card.className,
          active: inRange ? 1 : CONFIG.opacity,
          angle: Math.atan2(event.y - (rect.top + rect.height / 2), event.x - (rect.left + rect.width / 2)) * 180 / Math.PI + 90,
        });
      });

      setActiveStyles(updatedStyles);
    };

    const updateContainerStyles = () => {
      const container = containerRef.current;
      if (container) {
        container.style.setProperty('--gap', CONFIG.gap);
        container.style.setProperty('--blur', CONFIG.blur);
        container.style.setProperty('--spread', CONFIG.spread);
        container.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
      }
    };

    updateContainerStyles();
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [identifier]);

  return (
    <div ref={containerRef} className={`glow-container-${identifier} glow-container`}>
      <article className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`}>
        <div className="glows"></div>
        {children}
        {activeStyles.map((style, idx) => (
          <div
            key={idx}
            className={style.id}
            style={{
              '--active': style.active,
              '--start': style.angle,
            }}
          />
        ))}
      </article>
    </div>
  );
};

export default GlowCard;
