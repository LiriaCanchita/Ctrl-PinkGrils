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

async function cargarYMostrar() {
    const snapshot = await getDocs(collection(db, "vacantes"));
    const vacantes = [];
    snapshot.forEach(doc => vacantes.push({ 
    firestoreId: doc.id,  
    ...doc.data() 
}));

    const porArea = {};
    vacantes.forEach(v => {
        if (!porArea[v.area]) porArea[v.area] = [];
        porArea[v.area].push(v);
    });

    const contenedor = document.getElementById('contenedor-areas');
    let html = '';

    for (const area in porArea) {
        const lista = porArea[area];
        html += `
            <div class="area-grupo" data-area="${area}">
                <div class="area-titulo">
                    ${area} <span>${lista.length} vacante${lista.length > 1 ? 's' : ''}</span>
                </div>
                ${lista.map(v => `
                    <div class="card-vacante">
                        <img src="${v.imagen}" alt="${v.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${v.titulo}</h5>
                            <p class="card-area"><strong>Área:</strong> ${v.area} · ${v.experiencia}</p>
                            <p class="card-text"><strong>Descripción:</strong> ${v.descripcion}</p>
                            <div class="habilidades-lista">
                                ${(v.habilidades || []).map(h => `<span class="habilidad-tag">${h}</span>`).join('')}
                            </div>
                           <a href="rutaVacantes.html?id=${v.firestoreId}" class="btn-ver-ruta">Ver Ruta →</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    contenedor.innerHTML = html;

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const area = btn.dataset.area;
            document.querySelectorAll('.area-grupo').forEach(grupo => {
                grupo.classList.toggle('oculto', area !== 'todas' && grupo.dataset.area !== area);
            });
        });
    });
}

cargarYMostrar();