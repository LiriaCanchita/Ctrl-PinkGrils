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
window.guardarVacante = async function () {

    const titulo = document.getElementById("titulo").value.trim();
    const area = document.getElementById("area").value.trim();
    const experiencia = document.getElementById("experiencia").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const descripcionLarga = document.getElementById("descripcionLarga").value.trim();
    const imagen = document.getElementById("imagen").value.trim();

    const habilidades = document.getElementById("habilidades").value.split(",").map(x => x.trim());
    const requisitosObligatorios = document.getElementById("reqObli").value.split(",").map(x => x.trim());
    const requisitosDeseables = document.getElementById("reqDese").value.split(",").map(x => x.trim());
    const Faces = document.getElementById("faces").value.split(",").map(x => x.trim());
    const Dias = document.getElementById("dias").value.split(",").map(x => x.trim());
    const Documentos = document.getElementById("documentos").value.split(",").map(x => x.trim());

    if (!titulo || !area || !experiencia || !descripcion || !descripcionLarga || !imagen) {
        alert("Completa todos los campos obligatorios");
        return;
    }

    try {
        await addDoc(collection(db, "vacantes"), {
            titulo,
            area,
            experiencia,
            descripcion,
            descripcionLarga,
            imagen,
            habilidades,
            requisitosObligatorios,
            requisitosDeseables,
            Faces,
            Dias,
            Documentos,
            fecha: new Date().toISOString()
        });

        alert("Vacante creada correctamente 🚀");

    } catch (error) {
        console.error(error);
        alert("Error al guardar");
    }
};