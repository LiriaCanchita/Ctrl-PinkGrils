import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

const paginas = [
    {
        titulo: "Datos personales",
        imagen: "Imagenes/Imagen1.jpg",
        partes: `
            <label>Nombre completo</label>
            <input type="text" id="nombre" class="form-control" required>

            <label>Email</label>
            <input type="email" id="email" class="form-control" required>

            <label>Telefono</label>
            <input type="text" id="telefono" class="form-control" required>

            <label>DNI</label>
            <input type="text" id="dni" class="form-control" required>

            <label>Fecha de nacimiento</label>
            <input type="date" id="fecha" class="form-control" required>
        `
    }, {
        titulo: "Datos profesionales",
        imagen: "Imagenes/Imagen2.jpg",
        partes: `
            <label>Ultimo cargo o puesto</label>
            <input type="text" id="cargo" class="form-control" required>

            <label>Anos de experiencia</label>
            <select id="experiencia" class="form-control">
                <option>0-1 años</option>
                <option>1-2 años</option>
                <option>2-4 años</option>
                <option>4-5+ años</option>
            </select>

            <label>Nivel de estudios</label>
            <select id="estudios" class="form-control">
                <option>Educacion Basica</option>
                <option>Educacion Superior tecnica</option>
                <option>Educacion Superior universitaria</option>
            </select>

            <label>Universidad o Instituto</label>
            <input type="text" id="universidad" class="form-control" required>

            <label>Empresa en la que trabajo o trabaja</label>
            <input type="text" id="empresa" class="form-control" required>
        `
    }, {
    titulo: "Adjuntos:",
    imagen: "Imagenes/Imagen3.jpg",
    partes: `
        <label>Enlace a LinkedIn (opcional)</label>
        <input type="url" id="linkedin" class="form-control" placeholder="https://linkedin.com/in/tu-perfil">

        <label>Enlace a portafolio (opcional)</label>
        <input type="url" id="portafolio" class="form-control" placeholder="https://tuportafolio.com">

        <label>Envia tu hoja de vida por el siguiente correo:</label>

        <div style="background:#f0f0f0; width:100%; border-radius:6px; padding:12px; margin-bottom:12px;">
            <p class="mb-2" style="color:#555; font-size:0.82rem;">
                Tu informacion esta segura con nosotros. Los datos que registre seran utilizados 
                unicamente para conectarte con oportunidades laborales en Diners Club Peru y no 
                seran compartidos con terceros
            </p>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="aceptaTerminos">
                <label class="form-check-label" for="aceptaTerminos" style="font-size:0.82rem; color:#555;">
                    He leido y acepto el tratamiento de mis datos personales
                </label>
            </div>
        </div>
    `
}
];

function toggleTag(el) {
    const active = el.dataset.active === 'true';
    el.dataset.active = !active;
    el.style.background = !active ? '#072756' : 'white';
    el.style.color = !active ? 'white' : '#072756';
    el.style.border = '1px solid #072756';
}

window.toggleTag = toggleTag;

function guardarPaso() {

    // VALIDACIÓN PASO 1
    if (actual === 0) {
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();
        const dni = document.getElementById('dni')?.value.trim();
        const fecha = document.getElementById('fecha')?.value;

        if (!nombre || !email || !telefono || !dni || !fecha) {
            alert("Por favor completa todos los campos antes de continuar.");
            return false;
        }

        sessionStorage.setItem('nombre', nombre);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('telefono', telefono);
        sessionStorage.setItem('dni', dni);
        sessionStorage.setItem('fecha', fecha);
    }

    // VALIDACIÓN PASO 2
    if (actual === 1) {
        const cargo = document.getElementById('cargo')?.value.trim();
        const experiencia = document.getElementById('experiencia')?.value;
        const estudios = document.getElementById('estudios')?.value;
        const universidad = document.getElementById('universidad')?.value.trim();
        const empresa = document.getElementById('empresa')?.value.trim();

        if (!cargo || !experiencia || !estudios || !universidad || !empresa) {
            alert("Por favor completa todos los campos antes de continuar.");
            return false;
        }

        sessionStorage.setItem('cargo', cargo);
        sessionStorage.setItem('experiencia', experiencia);
        sessionStorage.setItem('estudios', estudios);
        sessionStorage.setItem('universidad', universidad);
        sessionStorage.setItem('empresa', empresa);
    }

    // PASO FINAL (sin validación obligatoria)
    if (actual === 2) {
    const acepta = document.getElementById('aceptaTerminos')?.checked;
    if (!acepta) {
        alert("Debes aceptar el tratamiento de tus datos personales para continuar.");
        return false;
    }

    const registro = {
        nombre:      sessionStorage.getItem('nombre'),
        email:       sessionStorage.getItem('email'),
        telefono:    sessionStorage.getItem('telefono'),
        dni:         sessionStorage.getItem('dni'),
        fecha:       sessionStorage.getItem('fecha'),
        cargo:       sessionStorage.getItem('cargo'),
        experiencia: sessionStorage.getItem('experiencia'),
        estudios:    sessionStorage.getItem('estudios'),
        universidad: sessionStorage.getItem('universidad'),
        empresa:     sessionStorage.getItem('empresa'),
        linkedin:    document.getElementById('linkedin')?.value.trim() || '',
        portafolio:  document.getElementById('portafolio')?.value.trim() || '',
        fecha_registro: new Date().toISOString()
    };

    enviarAFirebase(registro);
    return true;
}

    return true;
}

async function enviarAFirebase(registro) {
    const boton = document.getElementById('boton');
    boton.textContent = 'Guardando...';
    boton.disabled = true;

    try {
        await addDoc(collection(db, "candidatos"), registro);

        localStorage.setItem('perfil', JSON.stringify({
            nombre:      registro.nombre,
            experiencia: registro.experiencia,
            habilidades: [],
            areas:       []
        }));

        document.querySelector('.perfil-formulario').innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <h3 style="color:#003087; font-weight:700;">Registro exitoso</h3>
                <p style="color:#555; margin:12px 0 24px;">
                    Tus datos fueron guardados correctamente. 
                    Te contactaremos cuando surja una oportunidad que se ajuste a tu perfil.
                </p>
                <a href="explorar.html" 
                   style="background:#003087; color:#fff; border-radius:8px; padding:10px 24px; 
                          text-decoration:none; font-weight:600; font-size:14px;">
                    Ver oportunidades
                </a>
            </div>
        `;
    } catch (error) {
        console.error("Error al guardar en Firebase:", error);
        boton.textContent = 'Siguiente';
        boton.disabled = false;
        alert("Hubo un error al guardar tus datos. Intenta de nuevo.");
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
    boton.textContent = actual === paginas.length - 1 ? 'Ver mis oportunidades' : 'Siguiente';
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