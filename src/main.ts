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

// --- 9. Preloader & Master Intro Animation ---

const loaderPerc = document.getElementById('loader-perc');
const preloader = document.getElementById('preloader');

// Timeline Utama
const masterTl = gsap.timeline();

// Fungsi untuk menjalankan persentase (palsu tapi estetik)
let perc = { value: 0 };
gsap.to(perc, {
    value: 100,
    duration: 2,
    ease: "power4.inOut",
    onUpdate: () => {
        if (loaderPerc) loaderPerc.innerText = Math.floor(perc.value).toString();
    }
});

masterTl
    .to(".loader-text", {
        y: 0,
        duration: 0.8,
        ease: "expo.out",
        delay: 0.2
    })
    .to(".loader-bg", {
        y: 0,
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.5
    })
    // Transisi saat loader hilang
    .to(preloader, {
        yPercent: -100,
        duration: 1.5,
        ease: "expo.inOut"
    })
    // Masuk ke animasi Hero (Trigger setelah loader selesai)
    .from(".title-reveal", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.2
    }, "-=0.8") // Overlay sedikit dengan animasi loader
    .to(".featured-image-wrapper", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        ease: "expo.inOut"
    }, "-=1.2")
    .to(".reveal-img", {
        scale: 1,
        duration: 1.5,
        ease: "expo.inOut"
    }, "-=1.5")
    .set(preloader, { display: 'none' }); // Hapus total agar tidak mengganggu klik

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

// --- Bagian Animasi & Transisi About ---

const aboutSection = document.querySelector('#about') as HTMLElement;
const aboutText = document.querySelector('.about-text');
const cursorElement = document.querySelector('#cursor') as HTMLElement;

if (aboutSection && aboutText) {
    // 1. Animasi Reveal Teks (Fade + Slide Up)
    gsap.from(aboutText, {
        scrollTrigger: {
            trigger: "#about",
            start: "top 70%", // Animasi mulai saat section masuk 70% layar
        },
        y: 60,                // Muncul dari bawah
        opacity: 0,           // Dari transparan
        filter: "blur(10px)", // Efek blur saat muncul (opsional, sangat premium)
        duration: 2,
        ease: "power4.out"
    });

    // 2. Logika Inversi Warna (Background Hitam)
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 50%",    // Trigger saat bagian atas section di tengah layar
        end: "bottom 50%",   // Selesai saat bagian bawah section di tengah layar
        onEnter: () => {
            // Gunakan GSAP untuk transisi warna body agar sinkron dengan durasi CSS
            gsap.to("body", { backgroundColor: "#000000", color: "#f2f2f2", duration: 0.8 });
            gsap.to(cursorElement, { backgroundColor: "#ffffff", duration: 0.5 });
        },
        onLeaveBack: () => {
            // Kembali ke Light Mode saat scroll ke atas
            gsap.to("body", { backgroundColor: "#f2f2f2", color: "#1a1a1a", duration: 0.8 });
            gsap.to(cursorElement, { backgroundColor: "#000000", duration: 0.5 });
        },
        // Mencegah glitch jika user refresh di posisi scroll ini
        onRefresh: (self) => {
            if (self.isActive) {
                gsap.set("body", { backgroundColor: "#000000", color: "#f2f2f2" });
                gsap.set(cursorElement, { backgroundColor: "#ffffff" });
            }
        }
    });
}

// Logika Scroll Halus ke Section About
const aboutLink = document.querySelector('#about-link');

aboutLink?.addEventListener('click', (e) => {
    e.preventDefault(); // Mencegah lonjakan instan browser
    
    // Memberitahu Lenis untuk scroll ke elemen #about
    lenis.scrollTo('#about', {
        offset: 0,
        duration: 2, // Durasi dalam detik, bisa kamu sesuaikan
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function standar
    });
});

