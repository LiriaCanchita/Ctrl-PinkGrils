document.getElementById('form-perfil').addEventListener('submit', function (e) {
    e.preventDefault();

    const habilidades = Array.from(
        document.querySelectorAll('input[name="habilidad"]:checked')  
    ).map(cb => cb.value);

    const perfil = {
        nombre: document.getElementById('nombre').value,
        area: document.getElementById('area').value,
        habilidades: habilidades
    };

    localStorage.setItem('perfil', JSON.stringify(perfil));
    window.location.href = 'oportunidades.html';
});