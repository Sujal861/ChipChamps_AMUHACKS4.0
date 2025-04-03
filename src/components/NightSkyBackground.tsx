
import { useEffect, useRef } from 'react';

const NightSkyBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Star properties
    const stars: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
    }[] = [];
    
    // Create random stars
    const initStars = () => {
      const starCount = Math.floor(canvas.width * canvas.height / 2000); // Adjust density
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5 + 0.5;
        const speed = Math.random() * 0.05;
        
        // Create a slight color variation for stars
        const colors = [
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.9)',
          'rgba(240, 240, 255, 0.8)',
          'rgba(220, 220, 255, 0.9)',
          'rgba(255, 240, 230, 0.8)',
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        stars.push({ x, y, radius, color, speed });
      }
    };
    
    // Draw the night sky
    const drawNightSky = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f1123');
      gradient.addColorStop(0.5, '#1a1e3c');
      gradient.addColorStop(1, '#0c0e19');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    // Draw and animate stars
    const drawStars = () => {
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // Move star slightly (parallax effect)
        star.y += star.speed;
        
        // Reset star position if it moves off-screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
    };
    
    // Initialize and start animation
    initStars();
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNightSky();
      drawStars();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default NightSkyBackground;
