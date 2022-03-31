// Variables
const resultado = document.querySelector('#resultado');
const max = new Date().getFullYear(); // Anio actual
const min = max - 10;

// Definir variables de busqueda
const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');

const datosBusqueda = {
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    transmision: '',
    color: ''
};

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    mostrarAutos(autos); // Mostrar autos al levantar la app

    // Llenar el Select con anios
    llenarSelect();
});

// Definir eventos de los datos de busqueda
marca.addEventListener('change', e => {
    datosBusqueda.marca = e.target.value;

    filtrarAuto();
});

year.addEventListener('change', e => {
    datosBusqueda.year = parseInt(e.target.value);

    filtrarAuto();
});

minimo.addEventListener('change', e => {
    datosBusqueda.minimo = e.target.value;

    filtrarAuto();
});

maximo.addEventListener('change', e => {
    datosBusqueda.maximo = e.target.value;

    filtrarAuto();
});

puertas.addEventListener('change', e => {
    datosBusqueda.puertas = parseInt(e.target.value);

    filtrarAuto();
});

transmision.addEventListener('change', e => {
    datosBusqueda.transmision = e.target.value;

    filtrarAuto();
});

color.addEventListener('change', e => {
    datosBusqueda.color = e.target.value;

    filtrarAuto();
});


// Funciones
function mostrarAutos(autos) {
    limpiarAutoHTML();
   autos.forEach(auto => {
       const {marca, modelo, year, precio, puertas, color, transmision} = auto;
       const autoHTML = document.createElement('p');
       autoHTML.textContent = `
            ${marca} ${modelo} - ${year} - Precio: ${precio} -
            Puertas: ${puertas} - Color: ${color} - Transmision: ${transmision}
       `;
       resultado.appendChild(autoHTML);
   });
}

// Limpiar el autoHTML
function limpiarAutoHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function llenarSelect() {
    for (let i = max; i > min; i--) {
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion);
    }
}

function filtrarAuto() {
    const resultado = autos.filter(filtrarMarca).filter(filtrarYear)
                           .filter(filtrarMinimo).filter(filtrarMaximo)
                           .filter(filtrarPuertas).filter(filtrarTransmision)
                           .filter(filtrarColor);
    if (resultado.length) {
        mostrarAutos(resultado);
    } else {
        noHayResultados();
    }
}

function noHayResultados() {
    limpiarAutoHTML();
    const noResultado = document.createElement('div');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No existen resultados con ese criterio de busqueda';
    resultado.appendChild(noResultado);
}

function filtrarMarca(auto) {
    if (datosBusqueda.marca) {
        return datosBusqueda.marca === auto.marca;
    }
    return auto;
}

function filtrarYear(auto) {
    const {year} = datosBusqueda;
    if (year) {
        return year === auto.year;
    }
    return auto;
}

function filtrarMinimo(auto) {
    const {minimo} = datosBusqueda;
    if (minimo) {
        return auto.precio >= minimo;
    }
    return auto;
}

function filtrarMaximo(auto) {
    const {maximo} = datosBusqueda;
    if (maximo) {
        return auto.precio <= maximo;
    }
    return auto;
}

function filtrarPuertas(auto) {
    const {puertas} = datosBusqueda;
    if (puertas) {
        return auto.puertas === puertas;
    }
    return auto;
}

function filtrarTransmision(auto) {
    const {transmision} = datosBusqueda;
    if (transmision) {
        return auto.transmision === transmision;
    }
    return auto;
}

function filtrarColor(auto) {
    const {color} = datosBusqueda;
    if (color) {
        return auto.color === color;
    }
    return auto;
}

