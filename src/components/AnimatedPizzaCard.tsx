import { useEffect, useRef, useState } from 'react';

interface AnimatedPizzaCardProps {
  name: string;
  price: string;
  image: string; // Static fallback image
  onClick: () => void;
}

export function AnimatedPizzaCard({ name, price, image, onClick }: AnimatedPizzaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameImagesRef = useRef<HTMLImageElement[]>([]);

  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverFrame, setHoverFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const totalFrames = 87;

  // 1. Intersection Observer to check if the card is in the viewport (performance safeguard)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // 2. Preload the 87 frame images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/margherita/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        
        // As soon as the first frame loads, initialize dimensions and draw it
        if (i === 1) {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
          }
        }
        
        if (loadedCount === totalFrames) {
          setIsPreloaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setIsPreloaded(true);
        }
      };
      images.push(img);
    }
    frameImagesRef.current = images;
  }, []);

  // 3. Track scroll progress relative to the card's viewport position
  useEffect(() => {
    if (!isPreloaded || !isVisible || isHovered) return;

    const handleScroll = () => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Math mapping: card enters at bottom (rect.top = viewportHeight) and exits at top (rect.bottom = 0)
      const entry = viewportHeight - rect.top;
      const range = viewportHeight + rect.height;

      const progress = Math.max(0, Math.min(1, entry / range));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isPreloaded, isVisible, isHovered]);

  // 4. Smooth interpolation loop between current frame and target frame (driven by scroll or hover)
  useEffect(() => {
    if (!isPreloaded) return;

    const scrollFrameIndex = Math.min(totalFrames - 1, Math.floor(scrollProgress * (totalFrames - 1)));
    const targetFrame = isHovered ? totalFrames - 1 : scrollFrameIndex;

    let intervalId: number;

    const stepFrame = () => {
      setHoverFrame((prev) => {
        if (prev === targetFrame) {
          clearInterval(intervalId);
          return prev;
        }
        const diff = targetFrame - prev;
        const direction = diff > 0 ? 1 : -1;
        // Step size of 2 frames for snappier transitions
        const step = Math.abs(diff) >= 2 ? 2 * direction : diff;
        return prev + step;
      });
    };

    if (hoverFrame !== targetFrame) {
      intervalId = window.setInterval(stepFrame, 16); // ~60fps step
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, scrollProgress, isPreloaded, hoverFrame]);

  // 5. Draw active frame to Canvas
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = frameImagesRef.current[frameIdx];
    if (img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  };

  useEffect(() => {
    if (isPreloaded) {
      drawFrame(hoverFrame);
    }
  }, [hoverFrame, isPreloaded]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#C5A059]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none group shadow-lg"
    >
      {/* Product Image Area with Canvas or Static Image */}
      <div className="w-full aspect-[4/3] overflow-hidden relative bg-[#121212] flex items-center justify-center">
        
        {/* HTML5 Canvas Animato (Visible once loaded) */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain transition-opacity duration-300 absolute inset-0 ${
            isPreloaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback Static Image (Visible during load or if preloading isn't complete) */}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-300 transition-transform duration-500 group-hover:scale-105 ${
            isPreloaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          draggable={false}
        />
        
        {/* Loading Spinner */}
        {!isPreloaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-6 h-6 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col justify-center flex-grow text-left">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-bold text-[#F5F2EB] text-base sm:text-lg group-hover:text-[#C5A059] transition-colors">
            {name}
          </h3>
          <span className="text-[#C5A059] font-anton text-sm sm:text-base whitespace-nowrap">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
