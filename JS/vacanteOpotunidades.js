import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

function matchVacante(perfil, vacante) {
    const habilidadesPerfil = (perfil.habilidades || []).map(h => h.toLowerCase());
    const habilidadesVacante = (vacante.habilidades || []).map(h => h.toLowerCase());
    const areasPerfil = (perfil.areas || []).map(a => a.toLowerCase());

    let puntos = 0;
    let total = habilidadesVacante.length + 1;

    habilidadesVacante.forEach(h => {
        if (habilidadesPerfil.includes(h)) puntos++;
    });

    if (areasPerfil.includes((vacante.area || '').toLowerCase())) puntos++;

    return total > 0 ? Math.round((puntos / total) * 100) : 0;
}

function mejorMatch(vacantes, perfil) {
    return [...vacantes].sort((a, b) => matchVacante(perfil, b) - matchVacante(perfil, a));
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

    const snapshot = await getDocs(collection(db, "vacantes"));
    const vacantes = [];
    snapshot.forEach(doc => vacantes.push({ 
    firestoreId: doc.id, 
    ...doc.data() 
}));

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
                        <p class="card-area"><strong>Área:</strong> ${vacante.area} · ${vacante.experiencia}</p>
                        <p class="card-text"><strong>Descripción:</strong> ${vacante.descripcion}</p>
                        <div class="barra-match-wrapper">
                            <div class="barra-match">
                                <div class="barra-match-fill" style="width: ${match}%"></div>
                            </div>
                        </div>
                        <a href="rutaVacantes.html?id=${vacante.firestoreId}" class="btn-ver-ruta">Ver Ruta →</a>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

mostrar();