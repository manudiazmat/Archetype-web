document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // Sticky Header
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            header.style.backgroundColor = 'transparent';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll Down
            header.classList.add('hidden');
        } else {
            // Scroll Up
            header.classList.remove('hidden');
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            header.style.backdropFilter = 'blur(10px)';
        }

        lastScroll = currentScroll;
    });

    // Hero Load Animation
    setTimeout(() => {
        document.querySelector('.hero').classList.add('loaded');
    }, 100);

    // Organic Cursor Tracking
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // Pixelation effect on Hero section
    const baseVideo = document.getElementById('hero-video-base');
    const canvas = document.getElementById('hero-canvas-pixelated');
    const heroSection = document.getElementById('home');
    
    if (baseVideo && canvas && heroSection) {
        const ctx = canvas.getContext('2d');
        let requestRef;
        
        const initPixelation = () => {
            if (!baseVideo.videoWidth) {
                setTimeout(initPixelation, 100);
                return;
            }
            canvas.width = baseVideo.videoWidth;
            canvas.height = baseVideo.videoHeight;
        };

        if (baseVideo.readyState >= 2) {
            initPixelation();
        } else {
            baseVideo.addEventListener('loadeddata', initPixelation);
        }
        
        let targetX = -1000;
        let targetY = -1000;
        let currentX = -1000;
        let currentY = -1000;
        let hasMoved = false;
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            
            if (!hasMoved) {
                currentX = targetX;
                currentY = targetY;
                hasMoved = true;
            }
            canvas.style.opacity = '1';
        });
        
        heroSection.addEventListener('mouseleave', () => {
            canvas.style.opacity = '0';
            hasMoved = false;
        });
        
        let currentPixelFactor = 0.025;
        
        const updateEffect = () => {
            if (hasMoved) {
                const dx = targetX - currentX;
                const dy = targetY - currentY;
                
                // Smooth interpolation for the cursor position
                currentX += dx * 0.1;
                currentY += dy * 0.1;
                
                // Calculate speed based on distance to target
                const speed = Math.sqrt(dx * dx + dy * dy);
                const normalizedSpeed = Math.min(speed / 150, 1);
                
                // Dynamic pixel size: larger blocks when moving fast, smaller blocks when still
                const targetPixelFactor = 0.025 - (normalizedSpeed * 0.015);
                currentPixelFactor += (targetPixelFactor - currentPixelFactor) * 0.05;

                if (baseVideo.videoWidth && canvas.width) {
                    const w = canvas.width * currentPixelFactor;
                    const h = canvas.height * currentPixelFactor;
                    
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(baseVideo, 0, 0, w, h);
                    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
                }

                // Elastic radius and soft feathered mask instead of a hard clip-path
                const radius = 220 + (normalizedSpeed * 80);
                const mask = `radial-gradient(circle ${radius}px at ${currentX}px ${currentY}px, black 30%, transparent 90%)`;
                
                canvas.style.WebkitMaskImage = mask;
                canvas.style.maskImage = mask;
                canvas.style.clipPath = 'none'; // Ensure any old clip-path is cleared
            }
            requestRef = requestAnimationFrame(updateEffect);
        };
        
        requestRef = requestAnimationFrame(updateEffect);
        window.addEventListener('resize', initPixelation);
    }
});
