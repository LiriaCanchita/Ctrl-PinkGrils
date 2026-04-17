document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel__track");
    const slides = document.querySelectorAll(".carousel__slide");
    const dots = document.querySelectorAll(".carousel__dot");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        track.style.transform = `translateX(${-currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    // Auto avance cada 4 segundos
    setInterval(goToNext, 4000);

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            currentIndex = i;
            updateCarousel();
        });
    });

    updateCarousel();
});

document.addEventListener("keydown", function (e) {
    // Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {

        const password = prompt("Ingrese contraseña de administrador:");

        if (password === "contraseña123") {
            window.location.href = "admin.html";
        } else if (password !== null) {
            alert("Contraseña incorrecta");
        }
    }
});