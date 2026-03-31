document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // CV button alert (since it's not ready yet)
    const cvBtn = document.getElementById('cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('My CV is currently being updated! Please check back soon or contact me directly.');
        });
    }

    // Typewriter effect for header
    const typeWriterElement = document.querySelector('.typewriter-text');
    if (typeWriterElement) {
        const texts = ["Computer Engineering Student", "Jr-Developer", "Learner"];
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
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.7)';
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
