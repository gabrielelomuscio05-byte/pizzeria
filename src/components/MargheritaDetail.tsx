import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Scroll } from 'lucide-react';

interface MargheritaDetailProps {
  onBack: () => void;
}

const INGREDIENTS = [
  {
    name: 'Olio Extravergine',
    desc: 'Olio monovarietale a crudo, profumato ed erbaceo',
    labelStyle: { right: '4%', top: '24%' },
    labelMobileStyle: { right: '2%', top: '24%' },
    isLeft: false,
    image: '/olio.jpg',
  },
  {
    name: 'Basilico Fresco',
    desc: 'Foglie profumate selezionate dal nostro orto',
    labelStyle: { right: '2%', top: '38%' },
    labelMobileStyle: { right: '2%', top: '38%' },
    isLeft: false,
    image: '/basilico.jpg',
  },
  {
    name: 'Mozzarella di Bufala',
    desc: 'Fresca Mozzarella di Bufala Campana DOP filante',
    labelStyle: { left: '1%', top: '38%' },
    labelMobileStyle: { left: '2%', top: '38%' },
    isLeft: true,
    image: '/mozzarella.jpg',
  },
  {
    name: 'Salsa di Pomodoro',
    desc: 'Pomodoro San Marzano DOP dell\'Agro Nocerino',
    labelStyle: { left: '4%', top: '65%' },
    labelMobileStyle: { left: '2%', top: '65%' },
    isLeft: true,
    image: '/pomodori.jpg',
  },
  {
    name: 'Bordo Croccante',
    desc: 'Cornicione alveolato cotto nel forno a legna',
    labelStyle: { right: '4%', top: '74%' },
    labelMobileStyle: { right: '2%', top: '74%' },
    isLeft: false,
    fallbackGradient: 'from-amber-600/40 to-yellow-800/20',
  },
];

export function MargheritaDetail({ onBack }: MargheritaDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const replayAnim = () => {
    setAnimDone(false);
    setReplayKey((k) => k + 1);
  };

  const totalFrames = 87;
  const showIngredients = animDone;

  // 1. Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Preload images into memory
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/margherita/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === totalFrames) {
          setIsPreloading(false);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === totalFrames) {
          setIsPreloading(false);
        }
      };
      images.push(img);
    }
    frameImagesRef.current = images;
  }, []);

  // Unified frame drawer
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = frameImagesRef.current[frameIdx];
    if (img && img.complete) {
      if (canvas.width !== (img.naturalWidth || img.width)) {
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      // Hide ezgif watermark (bottom right corner)
      // Clears a rectangle where the watermark typically appears
      context.clearRect(canvas.width - 200, canvas.height - 40, 200, 40);

      // Hide the star watermark logo (bottom right quadrant, around x:1700-1780, y:860-940)
      context.fillStyle = '#000000';
      context.fillRect(1700, 860, 80, 80);
    }
  };

  // 3. Autoplay Effect (Simulates Video Autoplay using Canvas) for all devices
  useEffect(() => {
    if (isPreloading) return;

    let currentFrame = 0;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;
    let animFrameId: number;

    const play = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= interval) {
        lastTime = timestamp - (elapsed % interval);
        currentFrame++;
        if (currentFrame >= totalFrames - 1) {
          setAnimDone(true);
          drawFrame(totalFrames - 1);
          return;
        }
        drawFrame(currentFrame);
      }
      animFrameId = requestAnimationFrame(play);
    };

    // Draw first frame immediately
    drawFrame(0);

    const timeoutId = setTimeout(() => {
      animFrameId = requestAnimationFrame(play);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animFrameId);
    };
  }, [isPreloading, replayKey]);

  // Single physical vibration snap when ingredients fade in
  const wasShownRef = useRef(false);
  useEffect(() => {
    if (isPreloading) return;

    if (showIngredients !== wasShownRef.current) {
      wasShownRef.current = showIngredients;
      if (showIngredients && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    }
  }, [showIngredients, isPreloading]);



  if (isPreloading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1C1C1C] text-[#F5F2EB]">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-20 h-20 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
          <Scroll className="absolute text-[#C5A059] w-8 h-8 animate-pulse" />
        </div>
        <h3 className="font-anton uppercase text-xl sm:text-2xl tracking-widest mb-2 text-[#C5A059]">
          Preparazione Impasto...
        </h3>
        <p className="font-light text-white/60 text-sm">
          Caricamento animazione ({Math.round((imagesLoaded / totalFrames) * 100)}%)
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#121212]">
      {/* Scrollable Container defining the timeline height */}
      <div ref={containerRef} className="relative w-full" style={{ height: 'auto' }}>
        {/* Sticky Viewer viewport */}
        <div className={`relative py-8 min-h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center bg-[#121212] select-none`}>
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#C5A059]/30 text-white font-semibold transition-all cursor-pointer shadow-md select-none text-xs sm:text-sm"
            >
              <ArrowLeft size={16} />
              <span>Torna al Menu</span>
            </button>
          </div>

          {/* Replay control (shown once autoplay finishes) */}
          {animDone && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4 animate-fade-in">
              <p className="text-[#F5F2EB]/60 text-center text-xs sm:text-sm font-light max-w-md">
                Tocca o passa il cursore sugli ingredienti per scoprire i dettagli della nostra selezione DOP.
              </p>
              <button
                onClick={replayAnim}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 backdrop-blur-sm text-[#C5A059] font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#C5A059]/20 active:scale-95 transition-all shadow-md select-none"
                aria-label="Riproduci di nuovo l'animazione"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Rivedi Animazione</span>
              </button>
            </div>
          )}

          {/* Onboarding Guide Text */}
          <div
            className="text-center flex flex-col items-center gap-2 pointer-events-none px-4 z-40 mt-12 sm:mt-16 mb-2 md:mb-6"
          >
            <h2 className="font-anton text-3xl sm:text-5xl text-[#F5F2EB] uppercase tracking-wide drop-shadow-md">
              Margherita Classica
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C5A059] font-medium tracking-wide">
              {!animDone ? (
                <>
                  <div className="w-2.5 h-2.5 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
                  <span className="animate-pulse">Preparazione in corso...</span>
                </>
              ) : (
                <span className="animate-fade-in">L'arte della pizza tridimensionale</span>
              )}
            </div>
          </div>

          {/* Interactive Wrapper containing labels, SVG pointers, and Canvas */}
          <div ref={wrapperRef} className="relative w-full max-w-5xl h-full flex items-center justify-center px-4">

            {/* Sticky Canvas Pizza Frame Viewer */}
            <div className="relative w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] md:w-[900px] md:h-[900px] lg:w-[1000px] lg:h-[1000px] flex items-center justify-center z-10 transition-transform duration-500">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Ingredient labels positioned absolutely around the viewport (Only active/visible at scroll end) */}
            {INGREDIENTS.map((ing, idx) => {
              const isVisible = showIngredients;
              return (
                <div
                  key={`label-${idx}`}
                  className={`absolute flex items-center gap-1.5 sm:gap-2.5 transition-all duration-500 max-w-[105px] sm:max-w-[200px] md:max-w-[260px] select-none z-40 ${
                    ing.isLeft ? 'text-right' : 'text-left'
                  }`}
                  style={{
                    ...(isMobile && ing.labelMobileStyle ? ing.labelMobileStyle : ing.labelStyle),
                    opacity: isVisible ? 1 : 0,
                    transform: `translateY(${isVisible ? '0px' : '15px'})`,
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  {ing.isLeft ? (
                    <>
                      <div className="flex flex-col">
                        <span className="font-anton uppercase tracking-wider text-[#F5F2EB] text-[9px] sm:text-sm md:text-base leading-tight">
                          {ing.name}
                        </span>
                        <span className="hidden sm:block text-white/50 text-[10px] sm:text-xs mt-0.5 font-light leading-tight">
                          {ing.desc}
                        </span>
                      </div>
                      <div
                        className="w-8 h-8 sm:w-14 sm:h-14 rounded-full border border-[#C5A059]/40 sm:border-2 sm:border-[#C5A059]/60 flex-shrink-0 shadow-[0_0_10px_rgba(197,160,89,0.2)] sm:shadow-[0_0_15px_rgba(197,160,89,0.4)] overflow-hidden bg-[#151515] flex items-center justify-center transition-all duration-300 hover:scale-110 relative group/sphere"
                      >
                        {ing.image ? (
                          <img
                            src={ing.image}
                            alt={ing.name}
                            className="w-full h-full object-cover select-none"
                            draggable={false}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${ing.fallbackGradient || 'from-neutral-700 to-neutral-900'} flex items-center justify-center text-[7px] sm:text-[10px] text-[#C5A059] font-anton uppercase`}>
                            {ing.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-8 h-8 sm:w-14 sm:h-14 rounded-full border border-[#C5A059]/40 sm:border-2 sm:border-[#C5A059]/60 flex-shrink-0 shadow-[0_0_10px_rgba(197,160,89,0.2)] sm:shadow-[0_0_15px_rgba(197,160,89,0.4)] overflow-hidden bg-[#151515] flex items-center justify-center transition-all duration-300 hover:scale-110 relative group/sphere"
                      >
                        {ing.image ? (
                          <img
                            src={ing.image}
                            alt={ing.name}
                            className="w-full h-full object-cover select-none"
                            draggable={false}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${ing.fallbackGradient || 'from-neutral-700 to-neutral-900'} flex items-center justify-center text-[7px] sm:text-[10px] text-[#C5A059] font-anton uppercase`}>
                            {ing.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-anton uppercase tracking-wider text-[#F5F2EB] text-[9px] sm:text-sm md:text-base leading-tight">
                          {ing.name}
                        </span>
                        <span className="hidden sm:block text-white/50 text-[10px] sm:text-xs mt-0.5 font-light leading-tight">
                          {ing.desc}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

          </div>

          {/* Ambient Glow */}
          <div
            className="absolute -bottom-24 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full filter blur-[150px] opacity-10 pointer-events-none z-0"
            style={{ backgroundColor: '#C5A059' }}
          />

        </div>
      </div>

      {/* Info Panel Section (scrolls up naturally) */}
      <div className="relative z-50 bg-[#1C1C1C] border-t border-white/10 py-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-[#C5A059] font-anton text-sm uppercase tracking-widest">Informazioni Dettagliate</span>
            <h2 className="font-anton text-3xl sm:text-5xl text-[#F5F2EB] uppercase tracking-tight mt-2">
              Allergeni & Intolleranze
            </h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Allergens Card */}
            <div className="bg-[#151515] border border-white/5 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 text-left hover:border-[#C5A059]/20 transition-all duration-300">
              <h3 className="font-anton text-xl sm:text-2xl text-[#C5A059] uppercase tracking-wide">
                Allergeni Presenti
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                La nostra Margherita è preparata con ingredienti di prima scelta, ma contiene alcuni allergeni di riferimento da tenere in considerazione:
              </p>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#9E2A2B] mt-1.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white block text-sm">Glutine</strong>
                    <span className="text-white/50 text-xs font-light">Presente nella farina di grano tenero tipo 1 utilizzata per l'impasto.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#9E2A2B] mt-1.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white block text-sm">Lattosio (Latte)</strong>
                    <span className="text-white/50 text-xs font-light">Presente in grandi quantità nella Mozzarella di bufala campana DOP.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white block text-sm">Tracce di Frutta a Guscio / Soia</strong>
                    <span className="text-white/50 text-xs font-light">Possibile contaminazione crociata dovuta alle lavorazioni nel nostro laboratorio.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrients/Values Card */}
            <div className="bg-[#151515] border border-white/5 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 text-left hover:border-[#C5A059]/20 transition-all duration-300">
              <h3 className="font-anton text-xl sm:text-2xl text-[#C5A059] uppercase tracking-wide">
                Valori Nutrizionali
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Una porzione intera (circa 380g) fornisce circa 820 kcal, ricca di carboidrati complessi dall'impasto a pietra e grassi nobili dall'olio EVO a crudo e la mozzarella di bufala campana.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="block text-white/40 text-xs uppercase tracking-wider">Calorie</span>
                  <span className="text-xl sm:text-2xl font-anton text-[#C5A059] mt-1 block">820 kcal</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="block text-white/40 text-xs uppercase tracking-wider">Carboidrati</span>
                  <span className="text-xl sm:text-2xl font-anton text-white mt-1 block">95g</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="block text-white/40 text-xs uppercase tracking-wider">Proteine</span>
                  <span className="text-xl sm:text-2xl font-anton text-white mt-1 block">34g</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="block text-white/40 text-xs uppercase tracking-wider">Grassi</span>
                  <span className="text-xl sm:text-2xl font-anton text-white mt-1 block">26g</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
