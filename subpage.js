document.addEventListener('DOMContentLoaded', () => {
    // ---- Reveal on scroll ----
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 120;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ---- Sticky header (show/hide on scroll) ----
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = '';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
            header.style.backgroundColor = 'rgba(0,0,0,0.85)';
            header.style.backdropFilter = 'blur(12px)';
        }

        lastScroll = currentScroll;
    });

    // ---- Page hero load animation ----
    const pageHero = document.querySelector('.page-hero');
    if (pageHero) {
        setTimeout(() => pageHero.classList.add('loaded'), 80);
    }

    // ---- Mouse tracking for manifesto bg text ----
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // ---- Filter tabs (Collection page) ----
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // ---- Active nav link highlight ----
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPath) {
            link.style.opacity = '0.5';
        }
    });
});
