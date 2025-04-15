"use client";

import { useEffect, useRef } from 'react';

const GlowCard = ({ children, identifier }) => {
  const containerRef = useRef(null);

  // Create a ref for each glow card
  const cardRefs = useRef([]);

  // Reset cardRefs when the container changes
  useEffect(() => {
    if (containerRef.current) {
      cardRefs.current = Array.from(containerRef.current.children);
    }
  }, [identifier]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cards = cardRefs.current; // Now use the refs to access the cards directly

    if (!cards.length) return;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const UPDATE = (event) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        if (
          event?.x > rect.left - CONFIG.proximity &&
          event?.x < rect.left + rect.width + CONFIG.proximity &&
          event?.y > rect.top - CONFIG.proximity &&
          event?.y < rect.top + rect.height + CONFIG.proximity
        ) {
          card.style.setProperty('--active', 1);
        } else {
          card.style.setProperty('--active', CONFIG.opacity);
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let angle = (Math.atan2(event.y - centerY, event.x - centerX) * 180) / Math.PI;
        if (angle < 0) angle += 360;
        card.style.setProperty('--start', angle + 90);
      });
    };

    const RESTYLE = () => {
      containerRef.current.style.setProperty('--gap', CONFIG.gap);
      containerRef.current.style.setProperty('--blur', CONFIG.blur);
      containerRef.current.style.setProperty('--spread', CONFIG.spread);
      containerRef.current.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
    };

    RESTYLE();
    window.addEventListener('pointermove', UPDATE);

    return () => window.removeEventListener('pointermove', UPDATE);
  }, [identifier]);

  return (
    <div ref={containerRef} className={`glow-container-${identifier} glow-container`}>
      <article
        ref={(el) => cardRefs.current.push(el)} // Assign refs to each card
        className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`}>
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
