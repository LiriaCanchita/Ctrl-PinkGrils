async function cargarYMostrar() {
    const res = await fetch('DATA/vacantes.json');
    const vacantes = await res.json();

    // Agrupa por área
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
                                ${v.habilidades.map(h => `<span class="habilidad-tag">${h}</span>`).join('')}
                            </div>
                            <a href="../rutaVacantes.html?id=${v.id}" class="btn-ver-ruta">Ver Ruta →</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    contenedor.innerHTML = html;

    // Filtros
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const area = btn.dataset.area;
            document.querySelectorAll('.area-grupo').forEach(grupo => {
                if (area === 'todas' || grupo.dataset.area === area) {
                    grupo.classList.remove('oculto');
                } else {
                    grupo.classList.add('oculto');
                }
            });
        });
    });
}

cargarYMostrar();