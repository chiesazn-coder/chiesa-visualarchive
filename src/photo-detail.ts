import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger);

const photoStories: Record<string, any> = {
    "prau-series": {
        title: "Mount Prau Series",
        images: [
            "/prau-1.jpg", // 0: Hero
            "/prau-2.jpg", // 1: B&W Duo
            "/prau-3.jpg", // 2: B&W Duo
            "/prau-4.jpg", // 3: IG Feed 1
            "/prau-5.jpg", // 4: IG Feed 2
            "/prau-6.jpg"  // 5: IG Feed 3
        ],
        location: "Dieng, Wonosobo",
        year: "2024",
        story: `
            <p class="mb-8">Mendaki bukan sekadar perjalanan fisik, tapi sebuah dialog dengan diri sendiri. Di ketinggian 2.565 MDPL ini, saya belajar bahwa setiap langkah berat membawa perspektif yang lebih luas.</p>
            <p>Eksplorasi ini terbagi antara ketegasan monokrom yang menangkap tekstur bumi, dan kelembutan warna analog yang menangkap memori warna yang memudar namun nyata.</p>
        `
    }
};

// Smooth Scroll
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Cursor
// --- Bagian Custom Cursor yang Diperbarui ---
const cursor = document.querySelector('#cursor') as HTMLElement;

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out"
    });
});

// Fungsi untuk memberikan efek hover pada elemen gambar
function setupCursorHovers() {
    // Kita targetkan semua container gambar di halaman detail
    const imageContainers = document.querySelectorAll('#hero-image-container, .reveal-container, .bg-white');

    imageContainers.forEach((container) => {
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
}

// PANGGIL FUNGSI INI setelah semua gambar selesai di-render
// Masukkan di dalam blok "if (data) { ... }" paling bawah
setupCursorHovers();

// Logic Render
const params = new URLSearchParams(window.location.search);
const id = params.get('id') || "prau-series";
const data = photoStories[id];

if (data) {
    document.getElementById('detail-title')!.innerHTML = data.title;
    document.getElementById('detail-story')!.innerHTML = data.story;
    document.getElementById('meta-loc')!.innerText = data.location;
    document.getElementById('meta-year')!.innerText = data.year;

    // 1. Render Hero
    const heroContainer = document.getElementById('hero-image-container');
    if (heroContainer) {
        heroContainer.innerHTML = `
            <img src="${data.images[0]}" class="hero-img w-full h-full object-cover scale-110 opacity-0 transition-all duration-700 hover:scale-100">
        `;
    }

    // 2. Render Asymmetric Gallery
    const galleryContainer = document.getElementById('asymmetric-gallery');
    if (galleryContainer && data.images.length > 1) {
        const img = data.images;
        
        galleryContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div class="md:col-span-7 overflow-hidden rounded-sm bg-zinc-100 reveal-box group">
                    <img src="${img[1]}" class="gallery-img w-full h-full object-cover aspect-[4/5] md:aspect-square transition-transform duration-1000 group-hover:scale-110">
                </div>
                <div class="md:col-span-4 md:col-start-9 md:mt-32 overflow-hidden rounded-sm bg-zinc-100 reveal-box group">
                    <img src="${img[2]}" class="gallery-img w-full h-full object-cover aspect-[4/5] transition-transform duration-1000 group-hover:scale-110">
                </div>
            </div>

            <div class="reveal-box py-20">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-4 shadow-sm aspect-square flex items-center justify-center overflow-hidden group">
                        <img src="${img[3]}" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110">
                    </div>
                    <div class="bg-white p-4 shadow-sm aspect-square flex items-center justify-center overflow-hidden group">
                        <img src="${img[4]}" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110">
                    </div>
                    <div class="bg-white p-4 shadow-sm aspect-square flex items-center justify-center overflow-hidden group">
                        <img src="${img[5]}" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110">
                    </div>
                </div>
                <div class="mt-6 text-[9px] uppercase tracking-[0.4em] opacity-40 text-center italic">
                    Analog Archive — 35mm Format
                </div>
            </div>
        `;
    }

    // 3. ANIMATION TIMELINE
    const tl = gsap.timeline();

    tl.to(".hero-img", {
        opacity: 1, scale: 1, duration: 2, ease: "power2.inOut"
    });

    gsap.to("#detail-title", {
        scrollTrigger: { trigger: "#detail-title", start: "top 85%" },
        opacity: 1, y: 0, duration: 1.2, ease: "expo.out"
    });

    gsap.to(["#detail-story", "#detail-meta"], {
        scrollTrigger: { trigger: "#detail-story", start: "top 85%" },
        opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "expo.out"
    });

    document.querySelectorAll('.reveal-box').forEach((box) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: "expo.out"
        });
    });
}