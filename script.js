// Force page to always load at the top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Remove hash from URL if present without reloading to prevent auto-jumping
if (window.location.hash) {
    history.replaceState('', document.title, window.location.pathname + window.location.search);
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
});

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // CV button alert (since it's not ready yet)
    const cvBtn = document.getElementById('cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', (e) => {
            cvBtn.href = "Apil_Gaire_CV.pdf";
            cvBtn.download = "Apil_Gaire_CV.pdf";
            cvBtn.target = "_blank";
            // e.preventDefault();
            // alert('My CV is currently being updated! Please check back soon or contact me directly.');
        });
    }

    // Theme Switcher Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.documentElement; // using documentElement to set class/attribute
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Initialize Vanta.js Network Background
    let vantaEffect = null;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Skip heavy 3D rendering on mobile and low-end devices
    if (typeof VANTA !== 'undefined' && !isMobile && !prefersReducedMotion) {
        vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x8b5cf6, // Default to dark theme muted violet
            backgroundColor: 0x000000, 
            backgroundAlpha: 0.0, // Make it transparent so CSS gradient works
            points: 5.00,
            maxDistance: 15.00,
            spacing: 25.00
        });
    }

    if (themeToggle && icon) {
        // Retrieve saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (theme === 'light') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                if (vantaEffect) vantaEffect.setOptions({ color: 0x4f46e5 }); // Calm blue
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                if (vantaEffect) vantaEffect.setOptions({ color: 0x8b5cf6 }); // Muted violet
            }
        }
    }

    // Typewriter effect for header
    const typeWriterElement = document.querySelector('.typewriter-text');
    if (typeWriterElement) {
        const texts = ["Computer-Engineering Student", "Developer", "Learner"];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        // Ensure the cursor blinks continuously
        const cursorStyle = document.createElement('style');
        cursorStyle.innerHTML = `
            .cursor {
                display: inline-block;
                color: var(--primary-color);
                margin-left: 5px;
                animation: blink 1s step-end infinite;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(cursorStyle);

        function typeWriter() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typeWriterElement.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor">|</span>';

            let typeSpeed = isDeleting ? 40 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                // Pause at the end of the word
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move to the next word
                textIndex = (textIndex + 1) % texts.length;
                // Pause before typing next word
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Clear initial static HTML text
        typeWriterElement.innerHTML = '<span class="cursor">|</span>';

        setTimeout(typeWriter, 1000);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for fixed nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.transition = 'width 1s ease-in-out';
                            bar.style.width = targetWidth;
                        }, 200);
                    });
                }

                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all animate-able elements
    document.querySelectorAll('.fade-in, .slide-up, .skills-section').forEach(element => {
        observer.observe(element);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.glass-nav');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.style.background = 'var(--nav-bg-scrolled)';
            navbar.style.boxShadow = 'var(--glass-shadow)';
        } else {
            navbar.style.background = 'var(--nav-bg)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Simple cursor tracking for 3D effect on hero card
    const heroCard = document.querySelector('.hero-content');
    if (heroCard && window.innerWidth > 992) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            heroCard.style.transition = 'transform 0.5s ease';
        });

        heroCard.addEventListener('mouseenter', () => {
            heroCard.style.transition = 'none';
        });
    }
});
