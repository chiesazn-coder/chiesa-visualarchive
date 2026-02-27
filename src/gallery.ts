import './style.css'
import gsap from 'gsap'
import Lenis from 'lenis'

// 1. Smooth Scroll
const lenis = new Lenis();
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor
const cursor = document.querySelector('#cursor') as HTMLElement;
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out"
    });
});

// 3. Hover Effect
const items = document.querySelectorAll('.gallery-item');
items.forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 4, backgroundColor: 'white', mixBlendMode: 'difference' });
    });
    item.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: 'black', mixBlendMode: 'normal' });
    });
});

// 4. Reveal Animation saat buka halaman
gsap.from(".gallery-item", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
});