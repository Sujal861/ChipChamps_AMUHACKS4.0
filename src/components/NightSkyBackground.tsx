
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
      twinkleSpeed: number;
      twinklePhase: number;
      originalRadius: number;
    }[] = [];
    
    // Create random stars
    const initStars = () => {
      const starCount = Math.floor(canvas.width * canvas.height / 1800); // Increased density
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5 + 0.5;
        const speed = Math.random() * 0.05;
        const twinkleSpeed = Math.random() * 0.03 + 0.01;
        const twinklePhase = Math.random() * Math.PI * 2;
        
        // Create a slight color variation for stars
        const colors = [
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.9)',
          'rgba(240, 240, 255, 0.8)',
          'rgba(220, 220, 255, 0.9)',
          'rgba(255, 240, 230, 0.8)',
          'rgba(140, 200, 255, 0.7)', // Added blue hue
          'rgba(180, 180, 255, 0.8)', // Added light blue
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        stars.push({ 
          x, 
          y, 
          radius, 
          color, 
          speed, 
          twinkleSpeed, 
          twinklePhase, 
          originalRadius: radius 
        });
      }
    };
    
    // Add some nebula-like haze
    const drawNebula = () => {
      // Create a few cloudy areas with gradients
      const numberOfClouds = 3;
      
      for (let i = 0; i < numberOfClouds; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 400 + 200;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        // Random nebula colors
        const hue = Math.random() * 60 + 200; // Blues and purples
        const saturation = Math.random() * 20 + 70;
        const lightness = Math.random() * 10 + 10;
        
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.05)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    // Draw the night sky
    const drawNightSky = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0f23');
      gradient.addColorStop(0.5, '#141b3c');
      gradient.addColorStop(1, '#0c0e19');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle nebula effect
      drawNebula();
    };
    
    // Draw and animate stars
    const drawStars = (time: number) => {
      stars.forEach(star => {
        // Calculate twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const radiusNow = star.originalRadius * (1 + twinkle * 0.3);
        
        // Apply glow effect to larger stars
        if (radiusNow > 1.2) {
          ctx.shadowBlur = radiusNow * 4;
          ctx.shadowColor = star.color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, radiusNow, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Move star slightly (parallax effect)
        star.y += star.speed;
        
        // Reset star position if it moves off-screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
    };
    
    // Occasionally add a shooting star
    let lastShootingStarTime = 0;
    const shootingStarInterval = 8000; // New shooting star every ~8 seconds
    
    const createShootingStar = (time: number) => {
      if (time - lastShootingStarTime > shootingStarInterval) {
        lastShootingStarTime = time;
        
        // 30% chance to create a shooting star
        if (Math.random() > 0.7) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * (canvas.height / 3); // Start in top third
          const length = Math.random() * 100 + 50;
          const angle = Math.PI / 4 + (Math.random() * Math.PI / 4); // Angle between 45-90 degrees
          
          animateShootingStar(x, y, length, angle);
        }
      }
    };
    
    // Animate a shooting star
    const animateShootingStar = (x: number, y: number, length: number, angle: number) => {
      let progress = 0;
      const speed = 0.01 + Math.random() * 0.03;
      
      const draw = () => {
        if (progress >= 1) return;
        
        progress += speed;
        
        // Fade in then out
        let alpha = 1;
        if (progress < 0.3) {
          alpha = progress / 0.3;
        } else if (progress > 0.7) {
          alpha = (1 - progress) / 0.3;
        }
        
        const currentX = x + Math.cos(angle) * length * progress;
        const currentY = y + Math.sin(angle) * length * progress;
        
        const trailLength = length * 0.3;
        const trailX = currentX - Math.cos(angle) * trailLength;
        const trailY = currentY - Math.sin(angle) * trailLength;
        
        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          trailX, trailY, currentX, currentY
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
        
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Small glow at the head
        ctx.beginPath();
        ctx.arc(currentX, currentY, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fill();
        ctx.shadowBlur = 0;
        
        requestAnimationFrame(draw);
      };
      
      draw();
    };
    
    // Initialize and start animation
    initStars();
    
    // Animation loop
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNightSky();
      drawStars(time / 1000); // Convert to seconds
      createShootingStar(time);
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    
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
