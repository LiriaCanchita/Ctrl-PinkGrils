async function cargarVacantes() {
    const repo = await fetch('DATA/vacantes.json');
    const vacantes = await repo.json();
    return vacantes;
}

function matchVacante(usruario, vacante){
    const habilidadesUsuario = usruario.habilidades;
    const habilidadesVacantes = vacante.habilidades;
    const matchean = habilidadesUsuario.filter(h => habilidadesVacantes.includes(h));

    return Math.round((matchean.length/habilidadesVacantes.length)*100);
};

function mejorMatch(vacantes, perfil) {
    return vacantes
        .map(v => ({ ...v, match: matchVacante(perfil, v) }))
        .sort((a, b) => b.match - a.match);
}

