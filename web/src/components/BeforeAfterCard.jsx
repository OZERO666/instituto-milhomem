import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/apiServerClient';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const BeforeAfterCard = ({ item }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const pendingClientXRef = useRef(null);
  const containerRectRef = useRef(null);
  const { settings } = useSiteSettings();
  const useRafThrottle = settings?.perf_before_after_throttle !== 'false';

  const getImageUrl = (filename) => api.resolveMediaUrl('galeria', filename);

  const beforeUrl = getImageUrl(item.foto_antes);
  const afterUrl = getImageUrl(item.foto_depois);

  const updatePosition = (clientX) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = containerRectRef.current || container.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(newPosition);
  };

  const schedulePositionUpdate = (clientX) => {
    if (!useRafThrottle) {
      updatePosition(clientX);
      return;
    }

    pendingClientXRef.current = clientX;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingClientXRef.current !== null) {
        updatePosition(pendingClientXRef.current);
      }
    });
  };

  const capturePointer = (event) => {
    event.stopPropagation();
    event.preventDefault();
    handlePointerDown(event);
  };

  const handlePointerDown = (event) => {
    const container = containerRef.current;
    if (!container) return;

    containerRectRef.current = container.getBoundingClientRect();
    setIsDragging(true);
    schedulePositionUpdate(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const handlePointerMove = (event) => {
      schedulePositionUpdate(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      containerRectRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, useRafThrottle]);

  useEffect(() => () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden border border-primary shadow-md transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden bg-black"
        style={{ touchAction: 'none', userSelect: 'none' }}
        data-no-drag="true"
      >
        {beforeUrl && (
          <img
            src={beforeUrl}
            alt={`${item.titulo} - Antes`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {afterUrl && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img
              src={afterUrl}
              alt={`${item.titulo} - Depois`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#181B1E]/80 via-transparent to-transparent opacity-60"></div>

        <div
          className="absolute inset-y-0 flex items-center justify-center"
          style={{
            left: `${sliderPosition}%`,
            width: '44px',
            transform: 'translateX(-50%)',
            touchAction: 'none',
            userSelect: 'none',
            cursor: 'ew-resize',
          }}
          onPointerDown={capturePointer}
        >
          <div className="h-full w-px bg-white/60" />
        </div>

        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-2xl"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div className="w-10 h-10 flex items-center justify-center text-lg text-primary select-none" style={{ cursor: 'ew-resize' }}>
            ⇆
          </div>
        </div>

        {item.meses_pos_operatorio && (
          <div className="absolute bottom-4 right-4 bg-primary text-[#181B1E] px-3 py-1 rounded-md text-xs font-bold shadow-lg">
            {item.meses_pos_operatorio} meses
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BeforeAfterCard;
