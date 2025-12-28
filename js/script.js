/* ==========================================
   1. PAGE LOADER
   ========================================== */
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    loader.classList.add('hide');
    // Allow scroll after load
    document.body.style.overflow = 'auto'; // Re-enable scroll if disabled in CSS initially
});

/* ==========================================
   2. CURSOR GLOW EFFECT
   ========================================== */
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    // Clean subtle lag effect logic or direct follow
    // Using simple direct follow with CSS transition for smoothness
    const x = e.clientX;
    const y = e.clientY;

    cursorGlow.style.left = `${x}px`;
    cursorGlow.style.top = `${y}px`;
});

/* ==========================================
   3. TYPING ANIMATION (HERO)
   ========================================== */
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = this.txt;

        // Initial Type Speed
        let typeSpeed = 200;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.typing-text');
    const words = ["Machine Learning Engineer", "Data Scientist", "Full Stack Developer"];
    const wait = 2000;
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
}

/* ==========================================
   4. NAVIGATION & MOBILE MENU
   ========================================== */
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

// Sticky Header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show-menu');
    // Optional: Toggle Overlay
});

// Close Mobile Menu on Click
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('show-menu');
    });
});

/* ==========================================
   5. ACTIVE LINK HIGHLIGHT + SCROLL TO TOP
   ========================================== */
const sections = document.querySelectorAll('section[id]');
const scrollTopBtn = document.getElementById('scrollTopBtn');

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Adjust offset
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });

    // Scroll to Top visibility
    if (scrollY > 500) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
}

window.addEventListener('scroll', scrollActive);

/* ==========================================
   6. SCROLL REVEAL & SKILLS ANIMATION
   ========================================== */
const observerOptions = {
    threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;

            // Generic reveal
            entry.target.classList.add('active'); // CSS: .reveal-on-scroll.active

            // Skill Bars Specific Logic
            if (entry.target.id === 'skills') {
                const skillBars = document.querySelectorAll('.skill-bar-item');
                skillBars.forEach(bar => {
                    const percentage = bar.getAttribute('data-percentage');
                    const fill = bar.querySelector('.skill-progress-fill');
                    const percentText = bar.querySelector('.skill-percentage');

                    // Animate width
                    fill.style.width = percentage + '%';

                    // Animate number counter (simple)
                    let start = 0;
                    const duration = 1500;
                    const step = timestamp => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const currentVal = Math.min(Math.floor((progress / duration) * percentage), percentage);
                        percentText.textContent = currentVal + '%';
                        if (progress < duration) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                });
            }
            // Stop observing once revealed (optional)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    // Add base class for CSS transition styles
    el.classList.add('section-reveal');
    observer.observe(el);
});

/* ==========================================
   7. PROJECT SLIDER
   ========================================== */
const slides = document.querySelectorAll('.project-slide');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const dotsContainer = document.querySelector('.slider-dots');

let currentSlide = 0;
let slideInterval;
const autoPlayTime = 5000;

// Create Dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateSlide() {
    // Update Slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    // Update Dots
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    updateSlide();
}

function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    updateSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    resetTimer(); // Reset auto-play on manual interaction
}

// Controls
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
});

// Auto Play Logic
function startTimer() {
    slideInterval = setInterval(nextSlide, autoPlayTime);
}

function stopTimer() {
    clearInterval(slideInterval);
}

function resetTimer() {
    stopTimer();
    startTimer();
}

// Pause on hover
const sliderContainer = document.querySelector('.project-slider-container');
sliderContainer.addEventListener('mouseenter', stopTimer);
sliderContainer.addEventListener('mouseleave', startTimer);

// Init Slider
startTimer();

/* ==========================================
   8. FORM RIPPLE EFFECT
   ========================================== */
const rippleBtns = document.querySelectorAll('.ripple-btn');

rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        // e.preventDefault(); // Don't prevent default if it's a submit & we want it to "submit" (mock)

        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;

        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');
        this.appendChild(ripples);

        setTimeout(() => {
            ripples.remove();
        }, 600);

        // Mock Form Submission
        if (this.type === 'submit') {
            e.preventDefault();
            // Simple alert or status
            const originalText = this.innerHTML;
            this.innerHTML = 'Sending...';
            setTimeout(() => {
                this.innerHTML = 'Message Sent!';
                this.style.backgroundColor = '#10b981'; // Success Green
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                    document.getElementById('contactForm').reset();
                }, 2000);
            }, 1000);
        }
    });
});

/* ==========================================
   9. PARTICLES BACKGROUND
   ========================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Set Canvas Size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Size between 1 and 4
        this.speedX = Math.random() * 1 - 0.5; // Speed between -0.5 and 0.5
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(100, 200, 255, ${Math.random() * 0.3 + 0.1})`; // Light Blue, low opacity
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000; // Responsive count
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

// Handle Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Start
initParticles();
animateParticles();
