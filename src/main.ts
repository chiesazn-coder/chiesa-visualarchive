import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scrolling (Lenis) dengan Sinkronisasi ScrollTrigger
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor Logic
const cursor = document.querySelector('#cursor') as HTMLElement;
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out"
    });
});

// 3. Global Image Hover Interaction (Update: Berlaku untuk semua gambar)
const allImageContainers = document.querySelectorAll('.featured-image-wrapper, .parallax-container');

allImageContainers.forEach((container) => {
    container.addEventListener('mouseenter', () => {
        gsap.to(cursor, { 
            scale: 6, 
            backgroundColor: 'white', 
            mixBlendMode: 'difference',
            duration: 0.3
        });
    });
    container.addEventListener('mouseleave', () => {
        gsap.to(cursor, { 
            scale: 1, 
            backgroundColor: 'black', 
            mixBlendMode: 'normal',
            duration: 0.3
        });
    });
});

// 4. Initial Reveal Animation (Hero)
const tl = gsap.timeline();

tl.from(".title-reveal", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out",
    stagger: 0.2
})
.to(".featured-image-wrapper", {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1.5,
    ease: "expo.inOut"
}, "-=1")
.to(".reveal-img", {
    scale: 1,
    duration: 1.5,
    ease: "expo.inOut"
}, "-=1.5");

// 5. Efek Parallax untuk Gallery
const parallaxImages = document.querySelectorAll('.parallax-img');

parallaxImages.forEach((img) => {
    gsap.to(img, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// 6. Animasi Reveal & Color Switch untuk Section About
const aboutSection = document.querySelector('#about');
const aboutText = document.querySelector('.about-text');

if (aboutSection && aboutText) {
    // Reveal Teks saat di-scroll
    gsap.to(aboutText, {
        scrollTrigger: {
            trigger: "#about",
            start: "top 70%", // Mulai saat section 70% terlihat
        },
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out"
    });

    // Perubahan Warna Background (Dark Mode Trigger)
    ScrollTrigger.create({
        trigger: "#about",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to("body", { backgroundColor: "#000000", color: "#f2f2f2", duration: 0.8 });
            gsap.to(cursor, { backgroundColor: "#ffffff", duration: 0.5 }); // Cursor jadi putih
        },
        onLeaveBack: () => {
            gsap.to("body", { backgroundColor: "#f2f2f2", color: "#1a1a1a", duration: 0.8 });
            gsap.to(cursor, { backgroundColor: "#000000", duration: 0.5 }); // Cursor balik hitam
        }
    });
}

