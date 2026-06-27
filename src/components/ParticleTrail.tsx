import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  decay: number;
  type: 'leaf' | 'spark';
}

export function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Draw a premium minimalist basil leaf on canvas
  const drawBasilLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(77, 139, 49, 0.85)'; // Basil green
    ctx.beginPath();
    
    // Almond leaf curves
    ctx.moveTo(0, -size / 2);
    ctx.quadraticCurveTo(size / 3, -size / 4, size / 4, 0);
    ctx.quadraticCurveTo(size / 3, size / 4, 0, size / 2);
    ctx.quadraticCurveTo(-size / 3, size / 4, -size / 4, 0);
    ctx.quadraticCurveTo(-size / 3, -size / 4, 0, -size / 2);
    ctx.fill();

    // Subtle dark green center vein
    ctx.strokeStyle = 'rgba(43, 92, 27, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(0, -size / 2);
    ctx.stroke();

    ctx.restore();
  };

  // Draw a 4-pointed golden sparkle star
  const drawGoldSpark = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(197, 160, 89, 0.9)'; // Gold accent
    ctx.beginPath();
    
    // 4-pointed star coordinates
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.25, -size * 0.25);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.25, size * 0.25);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.25, size * 0.25);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.25, -size * 0.25);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  const spawnParticle = (x: number, y: number, isBurst = false) => {
    const speedMultiplier = isBurst ? 4.5 : 1.2;
    const type: 'leaf' | 'spark' = Math.random() > 0.45 ? 'leaf' : 'spark';
    const size = type === 'leaf' 
      ? (isBurst ? 10 + Math.random() * 12 : 12 + Math.random() * 10)
      : (isBurst ? 6 + Math.random() * 6 : 7 + Math.random() * 6);

    const newParticle: Particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * speedMultiplier,
      vy: ((Math.random() - 0.4) * speedMultiplier) - (isBurst ? 1.5 : 0.4), // drift upwards
      size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      alpha: 1,
      decay: isBurst ? 0.015 + Math.random() * 0.02 : 0.02 + Math.random() * 0.015,
      type,
    };

    particlesRef.current.push(newParticle);

    // Hard cap particles
    if (particlesRef.current.length > 120) {
      particlesRef.current.shift();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to window boundaries
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Frame update loop
    let animationId: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        // Draw particle
        if (p.type === 'leaf') {
          drawBasilLeaf(ctx, p.x, p.y, p.size, p.rotation, p.alpha);
        } else {
          drawGoldSpark(ctx, p.x, p.y, p.size, p.rotation, p.alpha);
        }
      });

      // Filter out dead particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

      animationId = requestAnimationFrame(update);
    };
    animationId = requestAnimationFrame(update);

    // Inputs tracking
    const handleMove = (clientX: number, clientY: number) => {
      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only trigger if moved a distance of 10px or more to throttles performance
      if (dist > 10) {
        spawnParticle(clientX, clientY);
        lastPosRef.current = { x: clientX, y: clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Handle Custom Burst Events
    const handleBurst = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      for (let i = 0; i < 28; i++) {
        spawnParticle(x, y, true);
      }
    };
    window.addEventListener('logo-burst', handleBurst);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('logo-burst', handleBurst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
    />
  );
}
