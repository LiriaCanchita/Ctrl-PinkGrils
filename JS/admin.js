import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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
const db = getFirestore(app);

// Preview + validación de peso
document.getElementById('imagenArchivo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const pesoKB = (file.size / 1024).toFixed(0);
    const pesoEl = document.getElementById('img-peso');

    if (file.size > 900 * 1024) {
        pesoEl.textContent = `⚠️ La imagen pesa ${pesoKB}KB — puede superar el límite de Firestore. Comprime la imagen antes.`;
        pesoEl.style.color = '#c0392b';
    } else {
        pesoEl.textContent = `✓ ${pesoKB}KB — tamaño correcto`;
        pesoEl.style.color = '#27ae60';
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('img-preview').src = ev.target.result;
        document.getElementById('preview-imagen').style.display = 'block';
    };
    reader.readAsDataURL(file);
});

function imagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result); // ya incluye "data:image/jpeg;base64,..."
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

window.guardarVacante = async function () {
    const titulo       = document.getElementById("titulo").value.trim();
    const area         = document.getElementById("area").value.trim();
    const experiencia  = document.getElementById("experiencia").value.trim();
    const descripcion  = document.getElementById("descripcion").value.trim();
    const descripcionLarga = document.getElementById("descripcionLarga").value.trim();
    const archivoImagen = document.getElementById("imagenArchivo").files[0];

    const habilidades          = document.getElementById("habilidades").value.split(",").map(x => x.trim()).filter(Boolean);
    const requisitosObligatorios = document.getElementById("reqObli").value.split(",").map(x => x.trim()).filter(Boolean);
    const requisitosDeseables  = document.getElementById("reqDese").value.split(",").map(x => x.trim()).filter(Boolean);
    const Documentos = document.getElementById("documentos").value.split(",").map(x => x.trim()).filter(Boolean);

    if (!titulo || !area || !experiencia || !descripcion || !descripcionLarga || !archivoImagen) {
        alert("Completa todos los campos, incluyendo la imagen.");
        return;
    }

    if (archivoImagen.size > 900 * 1024) {
        alert("La imagen es muy grande. Por favor comprime la imagen a menos de 900KB antes de subir.");
        return;
    }

    const boton = document.getElementById('admin-btn');
    boton.disabled = true;
    boton.textContent = 'Guardando...';

    try {
        const imagenBase64 = await imagenABase64(archivoImagen);

        await addDoc(collection(db, "vacantes"), {
            titulo, area, experiencia, descripcion, descripcionLarga,
            imagen: imagenBase64,
            habilidades, requisitosObligatorios, requisitosDeseables, Documentos,
            fecha: new Date().toISOString()
        });

        alert("✅ Vacante creada correctamente");
        document.querySelectorAll('.admin-form input, .admin-form textarea').forEach(el => el.value = '');
        document.getElementById('preview-imagen').style.display = 'none';

    } catch (error) {
        console.error(error);
        alert("Error al guardar: " + error.message);
    } finally {
        boton.disabled = false;
        boton.textContent = 'Guardar vacante';
    }
};