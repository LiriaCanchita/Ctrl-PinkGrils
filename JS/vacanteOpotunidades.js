console.log("JS cargado");

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

async function cargarVacantesFirebase() {
    const snapshot = await getDocs(collection(db, "vacantes"));

    const vacantes = [];

    snapshot.forEach(doc => {
        vacantes.push({
            id: doc.id,
            ...doc.data()
        });
    });

    console.log("Firebase:", vacantes); // 👈 AQUÍ

    return vacantes;
}

async function mostrar() {
    const perfilG = localStorage.getItem('perfil');

    if (!perfilG) {
        window.location.href = 'perfil.html';
        return;
    }

    const perfil = JSON.parse(perfilG);
    const nombre = perfil.nombre || 'Usuario';

    document.getElementById('saludo').innerHTML =
        `Hola <strong>${nombre}</strong>, hemos encontrado oportunidades para ti`;

    const vacantes = await cargarVacantes();
    const orden = mejorMatch(vacantes, perfil);
    const contenedor = document.getElementById('contenedor-vacantes');

    let html = "";

    orden.forEach(vacante => {
        const match = matchVacante(perfil, vacante);
        html += `
            <div class="col-12">
                <div class="card-vacante">
                    <img src="${vacante.imagen}" alt="${vacante.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${vacante.titulo}</h5>
                        <p class="card-area">
                            <strong>Área:</strong> ${vacante.area} · ${vacante.experiencia}
                        </p>
                        <p class="card-text">
                            <strong>Descripción:</strong> ${vacante.descripcion}
                        </p>
                        <div class="barra-match-wrapper">
                            <div class="barra-match">
                                <div class="barra-match-fill" style="width: ${match}%"></div>
                            </div>
                        </div>
                        <a href="rutaVacantes.html?id=${vacante.id}" class="btn-ver-ruta">
                            Ver Ruta →
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

mostrar();