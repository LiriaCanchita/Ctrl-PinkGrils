async function cargarVacantes() {
    const repo = await fetch('DATA/vacantes.json');
    const vacantes = await repo.json();
    return vacantes;
}

function matchVacante(usruario, vacante){
    const habilidadesUsuario = usruario.Habilidades;
    const habilidadesVacantes = vacante.Habilidades;
    const matchean = habilidadesUsuario.filter(h => habilidadesVacantes.includes(h));

    return Math.round((matchean.length/habilidadesVacantes.length)*100);
};

function mejorMatch(vacantes, perfil){
    return vacantes
    .map(v => ({...v, matchean: matchVacante(perfil, v)}))
    .sort((a,b)=>b.matchean - a.matchean);
}

