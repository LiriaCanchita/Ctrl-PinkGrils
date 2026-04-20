const paginas = [
    {
    titulo: "¿Quién eres?",
    imagen: "Imagenes/Imagen1.jpg",
    partes: `
        <label>Nombre completo</label>
        <input type="text" id="nombre" class="form-control" required>

        <label>Email</label>
        <input type="email" id="email" class="form-control" required>

        <label>Teléfono</label>
        <input type="text" id="telefono" class="form-control" required>
    `
}, {
    titulo: "Tu experiencia",
    imagen: "Imagenes/Imagen2.jpg",
    partes: `
        <label>Años de experiencia</label>
        <select id="experiencia" class="form-control">
            <option>0-1 años</option>
            <option>1-2 años</option>
            <option>2-4 años</option>
            <option>4-5+ años</option>
        </select>

        <label>Área de interés</label>
        <div class="form-control" style="height:auto; display:flex; flex-wrap:wrap; gap:8px; padding:10px;">
            <span onclick="toggleTag(this)" class="tag">Tecnología</span>
            <span onclick="toggleTag(this)" class="tag">Comercial</span>
            <span onclick="toggleTag(this)" class="tag">Marketing</span>
            <span onclick="toggleTag(this)" class="tag">Finanzas</span>
            <span onclick="toggleTag(this)" class="tag">Servicio al Cliente</span>
            <span onclick="toggleTag(this)" class="tag">Recursos Humanos</span>
        </div>

        <label>Nivel de estudios</label>
        <select id="estudios" class="form-control">
            <option>Educación Básica</option>
            <option>Educación Superior técnica</option>
            <option>Educación Superior universitaria</option>
        </select>
    `
}, {
    titulo: "Tus habilidades",
    imagen: "Imagenes/Imagen3.jpg",
    partes: `
        <label style="margin-bottom: 14px; display:block; color:#555; font-size:0.9rem; font-weight:500;">Selecciona las que tienes</label>

        <!-- Sección: Tecnología -->
        <div class="habi-seccion">
            <button type="button" class="habi-toggle" onclick="toggleSeccion(this)">
                <span>Tecnología</span>
                <span class="habi-arrow">▾</span>
            </button>
            <div class="habi-grid">
                <span onclick="toggleTag(this)" class="habi">JavaScript</span>
                <span onclick="toggleTag(this)" class="habi">SQL</span>
                <span onclick="toggleTag(this)" class="habi">Excel</span>
                <span onclick="toggleTag(this)" class="habi">Python</span>
                <span onclick="toggleTag(this)" class="habi">HTML/CSS</span>
                <span onclick="toggleTag(this)" class="habi">Power BI</span>
                <span onclick="toggleTag(this)" class="habi">Google Workspace</span>
                <span onclick="toggleTag(this)" class="habi">Word</span>
                <span onclick="toggleTag(this)" class="habi">PowerPoint</span>
            </div>
        </div>

        <!-- Sección: Habilidades Blandas -->
        <div class="habi-seccion">
            <button type="button" class="habi-toggle" onclick="toggleSeccion(this)">
                <span>Habilidades Blandas</span>
                <span class="habi-arrow">▾</span>
            </button>
            <div class="habi-grid">
                <span onclick="toggleTag(this)" class="habi">Comunicación</span>
                <span onclick="toggleTag(this)" class="habi">Trabajo en equipo</span>
                <span onclick="toggleTag(this)" class="habi">Liderazgo</span>
                <span onclick="toggleTag(this)" class="habi">Empatía</span>
                <span onclick="toggleTag(this)" class="habi">Adaptabilidad</span>
                <span onclick="toggleTag(this)" class="habi">Pensamiento crítico</span>
                <span onclick="toggleTag(this)" class="habi">Resolución de problemas</span>
                <span onclick="toggleTag(this)" class="habi">Gestión de proyectos</span>
            </div>
        </div>

        <!-- Sección: Comercial y Ventas -->
        <div class="habi-seccion">
            <button type="button" class="habi-toggle" onclick="toggleSeccion(this)">
                <span>Comercial y Ventas</span>
                <span class="habi-arrow">▾</span>
            </button>
            <div class="habi-grid">
                <span onclick="toggleTag(this)" class="habi">Ventas</span>
                <span onclick="toggleTag(this)" class="habi">Negociación</span>
                <span onclick="toggleTag(this)" class="habi">Atención al cliente</span>
                <span onclick="toggleTag(this)" class="habi">Orientación al cliente</span>
            </div>
        </div>

        <!-- Sección: Marketing -->
        <div class="habi-seccion">
            <button type="button" class="habi-toggle" onclick="toggleSeccion(this)">
                <span>Marketing</span>
                <span class="habi-arrow">▾</span>
            </button>
            <div class="habi-grid">
                <span onclick="toggleTag(this)" class="habi">Redes sociales</span>
                <span onclick="toggleTag(this)" class="habi">Canva</span>
                <span onclick="toggleTag(this)" class="habi">Marketing digital</span>
                <span onclick="toggleTag(this)" class="habi">Análisis de datos</span>
            </div>
        </div>

        <!-- Sección: Finanzas -->
        <div class="habi-seccion">
            <button type="button" class="habi-toggle" onclick="toggleSeccion(this)">
                <span>Finanzas</span>
                <span class="habi-arrow">▾</span>
            </button>
            <div class="habi-grid">
                <span onclick="toggleTag(this)" class="habi">Finanzas</span>
                <span onclick="toggleTag(this)" class="habi">Contabilidad</span>
                <span onclick="toggleTag(this)" class="habi">Gestión de riesgos</span>
            </div>
        </div>

        <!-- Sección: Recursos Humanos -->
        <div class="habi-seccion">
            <button type="button" class="habi-toggle" onclick="toggleSeccion(this)">
                <span>Recursos Humanos</span>
                <span class="habi-arrow">▾</span>
            </button>
            <div class="habi-grid">
                <span onclick="toggleTag(this)" class="habi">Reclutamiento</span>
                <span onclick="toggleTag(this)" class="habi">Inglés</span>
            </div>
        </div>
    `
}

]

function toggleTag(el) {
    const active = el.dataset.active === 'true';
    el.dataset.active = !active;
    el.style.background = !active ? '#072756' : 'white';
    el.style.color = !active ? 'white' : '#072756';
    el.style.border = '1px solid #072756';
}

function toggleSeccion(btn) {
    const grid = btn.nextElementSibling;
    const arrow = btn.querySelector('.habi-arrow');
    const abierto = grid.classList.contains('abierto');
    grid.classList.toggle('abierto', !abierto);
    arrow.style.transform = abierto ? 'rotate(0deg)' : 'rotate(180deg)';
}

function guardarPaso() {
    if (actual === 0) {
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();

        if (!nombre || !email || !telefono) {
            alert("Por favor completa todos los campos antes de continuar.");
            return false;
        }

        sessionStorage.setItem('nombre', nombre);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('telefono', telefono);
        return true;
    }

    if (actual === 1) {
        const experiencia = document.getElementById('experiencia')?.value;
        const estudios = document.getElementById('estudios')?.value;
        const areas = Array.from(document.querySelectorAll('.tag[data-active="true"]'))
            .map(t => t.textContent);

        if (areas.length === 0) {
            alert("Por favor selecciona al menos un área de interés.");
            return false;
        }

        sessionStorage.setItem('experiencia', experiencia);
        sessionStorage.setItem('estudios', estudios);
        sessionStorage.setItem('areas', JSON.stringify(areas));
        return true;
    }

    if (actual === 2) {
        const habilidades = Array.from(document.querySelectorAll('.habi[data-active="true"]'))
            .map(t => t.textContent);

        if (habilidades.length === 0) {
            alert("Por favor selecciona al menos una habilidad.");
            return false;
        }

        const perfil = {
            nombre:      sessionStorage.getItem('nombre'),
            email:       sessionStorage.getItem('email'),
            telefono:    sessionStorage.getItem('telefono'),
            experiencia: sessionStorage.getItem('experiencia'),
            estudios:    sessionStorage.getItem('estudios'),
            areas:       JSON.parse(sessionStorage.getItem('areas') || '[]'),
            habilidades: habilidades
        };

        localStorage.setItem('perfil', JSON.stringify(perfil));
        window.location.href = 'oportunidades.html';
        return true;
    }
}


let actual = 0;
const titulo = document.getElementById("titulo");
const imagen = document.getElementById("imagen");
const partes = document.getElementById("partes");
const boton = document.getElementById("boton");

function siguiente() {
    const paso = paginas[actual];
    titulo.textContent = paso.titulo;
    partes.innerHTML = paso.partes;
    imagen.style.backgroundImage = `url(${paso.imagen})`;
    boton.textContent = actual === paginas.length - 1 ? 'Ver mis oportunidades →' : 'Siguiente →';

}

boton.addEventListener("click", () => {
    const ok = guardarPaso();
    if (!ok) return; 

    if (actual < paginas.length - 1) {
        actual++;
        siguiente();
    }
});

siguiente();