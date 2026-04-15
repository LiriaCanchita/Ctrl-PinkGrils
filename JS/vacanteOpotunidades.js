async function mostrar() {
    const perfilG = localStorage.getItem('perfil');

    if (!perfilG) {
        window.location.href = 'perfil.html';
        return;
        //?Ver como poner algo bonito para avisar
    }

    const perfil = JSON.parse(perfilG);

    //?Ver como poner algo bonito para saludar
    document.getElementById('saludo').innerHTML =
        `
        <p>Hola <strong>${perfil.nombre}</strong>, 
        estas son las oportunidades que más se alinean con tu perfil </p>
    `;

    const vacantes = await cargarVacantes()
    const orden = mejorMatch(vacantes, perfil);
    const contenedor = document.getElementById('contenedor-vacantes');

    orden.forEach(vacante => {
        contenedor.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 p-3">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${vacante.match}% de coincidencia</span>
                        <h5 class="card-title">${vacante.titulo}</h5>
                        <p class="card-text text-muted">${vacante.area}</p>
                        <p class="card-text">${vacante.descripcion}</p>
                        <a href="detalleVacante.html?id=${vacante.id}" class="btn btn-outline-primary mt-2">
                            Ver ruta de postulación →
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

}

mostrar();