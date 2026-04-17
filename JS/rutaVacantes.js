function obtenerId() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    console.log("ID:", id);
    return id;
}

async function obtenerVacanteActual() {
    const id = obtenerId();
    const vacantes = await cargarVacantes();

    return vacantes.find(v => v.id == Number(id));
}

async function cargarDetalle() {
    const vacante = await obtenerVacanteActual();

    console.log("Vacante encontrada:", vacante);

    if (!vacante) {
        console.log("No se encontró la vacante con ese ID");
        return;
    }

    // Título y subtítulo
    document.querySelector(".job-hero__title").textContent = vacante.titulo;
    document.querySelector(".job-hero__subtitle").textContent =
        `${vacante.area} · ${vacante.experiencia}`;

    // Descripción larga
    document.querySelectorAll(".job-extra-info__text").forEach(el => {
        el.textContent = vacante.descripcionLarga;
    });

    // Imagen del hero
    if (vacante.imagen) {
        document.querySelector(".job-hero__image img").src = vacante.imagen;
    }

    // Requisitos obligatorios
    const listaObligatorios = document.querySelector(".requirements-slide:nth-child(1) .requirements-card__content ul");
    if (listaObligatorios) {
        listaObligatorios.innerHTML = vacante.requisitosObligatorios
            .map(r => `<li>${r}</li>`).join('');
    }

    // Requisitos deseables
    const listaDeseables = document.querySelector(".requirements-slide:nth-child(2) .requirements-card__content ul");
    if (listaDeseables) {
        listaDeseables.innerHTML = vacante.requisitosDeseables
            .map(r => `<li>${r}</li>`).join('');
    }

    // Documentos
    const listaDocumentos = document.querySelector(".requirements-slide:nth-child(3) .requirements-card__content ul");
    if (listaDocumentos) {
        listaDocumentos.innerHTML = vacante.Documentos
            .map(d => `<li>${d}</li>`).join('');
    }
}

document.addEventListener("DOMContentLoaded", () => {

    cargarDetalle();
    /* =========================================
       INICIO EN LA PARTE SUPERIOR AL CARGAR
    ========================================= */
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });

    /* =========================================
       ELEMENTOS
    ========================================= */
    const body = document.body;

    const toggleInfoBtn = document.getElementById("toggleInfoBtn");
    const jobExtraInfo = document.getElementById("jobExtraInfo");

    const carousel = document.querySelector(".requirements-carousel");
    const track = document.querySelector(".requirements-carousel__track");
    const slides = document.querySelectorAll(".requirements-slide");
    const prevBtn = document.querySelector(".requirements-carousel__btn--prev");
    const nextBtn = document.querySelector(".requirements-carousel__btn--next");
    const dots = document.querySelectorAll(".requirements-carousel__dot");

    /* =========================================
       BOTÓN "VER MÁS" / "VER MENOS"
    ========================================= */
    if (toggleInfoBtn && jobExtraInfo) {
        let isOpen = false;
        let isAnimatingInfo = false;

        const setInfoStylesForOpen = () => {
            jobExtraInfo.hidden = false;
            jobExtraInfo.style.display = "block";
            jobExtraInfo.style.overflow = "hidden";
            jobExtraInfo.style.opacity = "0";
            jobExtraInfo.style.maxHeight = "0px";
            jobExtraInfo.style.transform = "translateY(-10px)";
            jobExtraInfo.style.transition =
                "max-height 0.45s ease, opacity 0.35s ease, transform 0.35s ease";
        };

        const openInfo = () => {
            if (isAnimatingInfo) return;
            isAnimatingInfo = true;

            setInfoStylesForOpen();

            requestAnimationFrame(() => {
                const fullHeight = jobExtraInfo.scrollHeight;

                jobExtraInfo.style.maxHeight = `${fullHeight + 20}px`;
                jobExtraInfo.style.opacity = "1";
                jobExtraInfo.style.transform = "translateY(0)";
            });

            toggleInfoBtn.setAttribute("aria-expanded", "true");
            toggleInfoBtn.textContent = "Ver menos";
            isOpen = true;

            setTimeout(() => {
                jobExtraInfo.style.maxHeight = "none";
                isAnimatingInfo = false;
            }, 500);
        };

        const closeInfo = () => {
            if (isAnimatingInfo) return;
            isAnimatingInfo = true;

            const fullHeight = jobExtraInfo.scrollHeight;
            jobExtraInfo.style.overflow = "hidden";
            jobExtraInfo.style.maxHeight = `${fullHeight}px`;
            jobExtraInfo.style.opacity = "1";
            jobExtraInfo.style.transform = "translateY(0)";
            jobExtraInfo.style.transition =
                "max-height 0.4s ease, opacity 0.3s ease, transform 0.3s ease";

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
                jobExtraInfo.style.display = "";
                jobExtraInfo.style.overflow = "";
                jobExtraInfo.style.opacity = "";
                jobExtraInfo.style.maxHeight = "";
                jobExtraInfo.style.transform = "";
                jobExtraInfo.style.transition = "";
                isAnimatingInfo = false;
            }, 420);
        };

        toggleInfoBtn.addEventListener("click", () => {
            if (isOpen) {
                closeInfo();
            } else {
                openInfo();
            }
        });
    }

    /* =========================================
       CARRUSEL MANUAL
    ========================================= */
    if (carousel && track && slides.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        let isAnimatingCarousel = false;
        const totalSlides = slides.length;

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
                dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
            });
        };

        const updateSlidesAccessibility = () => {
            slides.forEach((slide, index) => {
                const isActive = index === currentIndex;
                slide.classList.toggle("active", isActive);
                slide.setAttribute("aria-hidden", isActive ? "false" : "true");
            });
        };

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
            updateSlidesAccessibility();
        };

        const moveToSlide = (index) => {
            if (isAnimatingCarousel) return;
            isAnimatingCarousel = true;

            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            track.style.transition = "transform 0.55s ease-in-out";
            updateCarousel();

            setTimeout(() => {
                isAnimatingCarousel = false;
            }, 560);
        };

        prevBtn.addEventListener("click", () => {
            moveToSlide(currentIndex - 1);
        });

        nextBtn.addEventListener("click", () => {
            moveToSlide(currentIndex + 1);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                if (index !== currentIndex) {
                    moveToSlide(index);
                }
            });
        });

        /* =========================================
           TECLADO
        ========================================= */
        document.addEventListener("keydown", (event) => {
            const activeTag = document.activeElement.tagName.toLowerCase();
            const isTyping =
                activeTag === "input" ||
                activeTag === "textarea" ||
                document.activeElement.isContentEditable;

            if (isTyping) return;

            if (event.key === "ArrowLeft") {
                moveToSlide(currentIndex - 1);
            }

            if (event.key === "ArrowRight") {
                moveToSlide(currentIndex + 1);
            }
        });

        /* =========================================
           DESLIZAR EN CELULAR
        ========================================= */
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        track.addEventListener(
            "touchstart",
            (e) => {
                startX = e.touches[0].clientX;
                endX = startX;
            },
            { passive: true }
        );

        track.addEventListener(
            "touchmove",
            (e) => {
                endX = e.touches[0].clientX;
            },
            { passive: true }
        );

        track.addEventListener("touchend", () => {
            const distance = startX - endX;

            if (Math.abs(distance) > minSwipeDistance) {
                if (distance > 0) {
                    moveToSlide(currentIndex + 1);
                } else {
                    moveToSlide(currentIndex - 1);
                }
            }

            startX = 0;
            endX = 0;
        });

        /* =========================================
           ESTADO INICIAL
        ========================================= */
        track.style.transform = "translateX(0)";
        track.style.transition = "transform 0.55s ease-in-out";
        updateDots();
        updateSlidesAccessibility();
    }

    /* =========================================
       ANIMACIONES AL APARECER
    ========================================= */
    const animatedElements = document.querySelectorAll(
        ".job-hero, .job-requirements, .requirements-card, .job-requirements__cta, .job-requirements__text, .footer"
    );

    const revealElement = (element) => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
        element.style.transition = "opacity 0.75s ease, transform 0.75s ease";
    };

    animatedElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(24px)";
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        revealElement(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.14
            }
        );

        animatedElements.forEach((element) => observer.observe(element));
    } else {
        animatedElements.forEach((element) => revealElement(element));
    }

    /* =========================================
       EFECTO DE BOTONES
    ========================================= */
    const allButtons = document.querySelectorAll(".btn, button");

    allButtons.forEach((button) => {
        button.addEventListener("mousedown", () => {
            button.style.transform = "scale(0.98)";
        });

        button.addEventListener("mouseup", () => {
            button.style.transform = "";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });

        button.addEventListener("touchstart", () => {
            button.style.transform = "scale(0.98)";
        }, { passive: true });

        button.addEventListener("touchend", () => {
            button.style.transform = "";
        });
    });

    /* =========================================
       SCROLL SUAVE EN ENLACES INTERNOS
    ========================================= */
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /* =========================================
       CLASE DE CONTROL
    ========================================= */
    body.classList.add("js-ready");
});

/* =========================================
   ASEGURAR ARRIBA AL TERMINAR DE CARGAR TODO
========================================= */
window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});