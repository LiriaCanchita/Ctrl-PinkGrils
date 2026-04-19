import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDd3BvvhuMXG2GkSbnDK6n5U_1fahb9zoE",
    authDomain: "dinersclub-d9204.firebaseapp.com",
    projectId: "dinersclub-d9204",
    storageBucket: "dinersclub-d9204.firebasestorage.app",
    messagingSenderId: "779647853011",
    appId: "1:779647853011:web:9815b4708b892a34218f26",
    measurementId: "G-CV4P14YXB7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function obtenerId() {
    return new URLSearchParams(window.location.search).get("id");
}

async function cargarDetalle() {
    const id = obtenerId();
    if (!id) { console.log("No hay ID en la URL"); return; }

    try {
        const docSnap = await getDoc(doc(db, "vacantes", id));
        if (!docSnap.exists()) { console.log("Vacante no encontrada:", id); return; }

        const v = { id: docSnap.id, ...docSnap.data() };
        console.log("Vacante cargada:", v);

        // Título y subtítulo
        document.querySelector(".job-hero__title").textContent = v.titulo || '';
        document.querySelector(".job-hero__subtitle").textContent = `${v.area || ''} · ${v.experiencia || ''}`;

        // Imagen hero
        const heroImg = document.querySelector(".job-hero__image img");
        if (heroImg && v.imagen) {
            heroImg.src = v.imagen;
            heroImg.alt = v.titulo || 'Imagen de la vacante';
        }

        // Descripción larga
        const textos = document.querySelectorAll(".job-extra-info__text");
        if (textos[0]) textos[0].textContent = v.descripcionLarga || '';
        if (textos[1]) textos[1].textContent = '';

        // Requisitos obligatorios
        const listaObli = document.querySelector(".requirements-slide:nth-child(1) .requirements-card__content ul");
        if (listaObli && v.requisitosObligatorios?.length) {
            listaObli.innerHTML = v.requisitosObligatorios.map(r => `<li>${r}</li>`).join('');
        }

        // Requisitos deseables
        const listaDese = document.querySelector(".requirements-slide:nth-child(2) .requirements-card__content ul");
        if (listaDese && v.requisitosDeseables?.length) {
            listaDese.innerHTML = v.requisitosDeseables.map(r => `<li>${r}</li>`).join('');
        }

        // Documentos
        const listaDocs = document.querySelector(".requirements-slide:nth-child(3) .requirements-card__content ul");
        if (listaDocs && v.Documentos?.length) {
            listaDocs.innerHTML = v.Documentos.map(d => `<li>${d}</li>`).join('');
        }

    } catch (error) {
        console.error("Error cargando vacante:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    // ← cargarDetalle va AQUÍ dentro, esperando a que el DOM esté listo
    await cargarDetalle();

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const body = document.body;
    const toggleInfoBtn = document.getElementById("toggleInfoBtn");
    const jobExtraInfo = document.getElementById("jobExtraInfo");
    const carousel = document.querySelector(".requirements-carousel");
    const track = document.querySelector(".requirements-carousel__track");
    const slides = document.querySelectorAll(".requirements-slide");
    const prevBtn = document.querySelector(".requirements-carousel__btn--prev");
    const nextBtn = document.querySelector(".requirements-carousel__btn--next");
    const dots = document.querySelectorAll(".requirements-carousel__dot");

    if (toggleInfoBtn && jobExtraInfo) {
        let isOpen = false;
        let isAnimatingInfo = false;

        const openInfo = () => {
            if (isAnimatingInfo) return;
            isAnimatingInfo = true;
            jobExtraInfo.hidden = false;
            jobExtraInfo.style.display = "block";
            jobExtraInfo.style.overflow = "hidden";
            jobExtraInfo.style.opacity = "0";
            jobExtraInfo.style.maxHeight = "0px";
            jobExtraInfo.style.transform = "translateY(-10px)";
            jobExtraInfo.style.transition = "max-height 0.45s ease, opacity 0.35s ease, transform 0.35s ease";
            requestAnimationFrame(() => {
                jobExtraInfo.style.maxHeight = `${jobExtraInfo.scrollHeight + 20}px`;
                jobExtraInfo.style.opacity = "1";
                jobExtraInfo.style.transform = "translateY(0)";
            });
            toggleInfoBtn.setAttribute("aria-expanded", "true");
            toggleInfoBtn.textContent = "Ver menos";
            isOpen = true;
            setTimeout(() => { jobExtraInfo.style.maxHeight = "none"; isAnimatingInfo = false; }, 500);
        };

        const closeInfo = () => {
            if (isAnimatingInfo) return;
            isAnimatingInfo = true;
            jobExtraInfo.style.overflow = "hidden";
            jobExtraInfo.style.maxHeight = `${jobExtraInfo.scrollHeight}px`;
            jobExtraInfo.style.opacity = "1";
            jobExtraInfo.style.transform = "translateY(0)";
            jobExtraInfo.style.transition = "max-height 0.4s ease, opacity 0.3s ease, transform 0.3s ease";
            requestAnimationFrame(() => {
                jobExtraInfo.style.maxHeight = "0px";
                jobExtraInfo.style.opacity = "0";
                jobExtraInfo.style.transform = "translateY(-10px)";
            });
            toggleInfoBtn.setAttribute("aria-expanded", "false");
            toggleInfoBtn.textContent = "Ver más";
            isOpen = false;
            setTimeout(() => {
                jobExtraInfo.hidden = true;
                jobExtraInfo.style.cssText = "";
                isAnimatingInfo = false;
            }, 420);
        };

        toggleInfoBtn.addEventListener("click", () => isOpen ? closeInfo() : openInfo());
    }

    if (carousel && track && slides.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        let isAnimatingCarousel = false;
        const totalSlides = slides.length;

        const updateDots = () => {
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentIndex);
                dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");
            });
        };

        const updateSlides = () => {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === currentIndex);
                slide.setAttribute("aria-hidden", i === currentIndex ? "false" : "true");
            });
        };

        const moveToSlide = (index) => {
            if (isAnimatingCarousel) return;
            isAnimatingCarousel = true;
            if (index < 0) currentIndex = totalSlides - 1;
            else if (index >= totalSlides) currentIndex = 0;
            else currentIndex = index;
            track.style.transition = "transform 0.55s ease-in-out";
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
            updateSlides();
            setTimeout(() => { isAnimatingCarousel = false; }, 560);
        };

        prevBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));
        nextBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));
        dots.forEach((dot, i) => dot.addEventListener("click", () => { if (i !== currentIndex) moveToSlide(i); }));

        document.addEventListener("keydown", (e) => {
            const tag = document.activeElement.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea" || document.activeElement.isContentEditable) return;
            if (e.key === "ArrowLeft") moveToSlide(currentIndex - 1);
            if (e.key === "ArrowRight") moveToSlide(currentIndex + 1);
        });

        let startX = 0, endX = 0;
        track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; endX = startX; }, { passive: true });
        track.addEventListener("touchmove", (e) => { endX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener("touchend", () => {
            const dist = startX - endX;
            if (Math.abs(dist) > 50) moveToSlide(dist > 0 ? currentIndex + 1 : currentIndex - 1);
            startX = 0; endX = 0;
        });

        track.style.transform = "translateX(0)";
        track.style.transition = "transform 0.55s ease-in-out";
        updateDots();
        updateSlides();
    }

    const animatedElements = document.querySelectorAll(
        ".job-hero, .job-requirements, .requirements-card, .job-requirements__cta, .job-requirements__text, .footer"
    );
    const revealElement = (el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.style.transition = "opacity 0.75s ease, transform 0.75s ease";
    };
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
    });
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { revealElement(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.14 });
        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => revealElement(el));
    }

    document.querySelectorAll(".btn, button").forEach(btn => {
        btn.addEventListener("mousedown", () => btn.style.transform = "scale(0.98)");
        btn.addEventListener("mouseup", () => btn.style.transform = "");
        btn.addEventListener("mouseleave", () => btn.style.transform = "");
        btn.addEventListener("touchstart", () => btn.style.transform = "scale(0.98)", { passive: true });
        btn.addEventListener("touchend", () => btn.style.transform = "");
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
        });
    });

    body.classList.add("js-ready");
});

window.addEventListener("load", () => window.scrollTo(0, 0));