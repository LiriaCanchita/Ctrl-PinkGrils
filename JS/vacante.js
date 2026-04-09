async function cargar(){
    const vacantes = await cargarVacantes();
    console.log("Vacantes cargadas: ", vacantes);
}
cargar();