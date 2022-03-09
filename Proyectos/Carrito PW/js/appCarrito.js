// Definir variables
const carrito = document.querySelector('#carrito');
const listaCarrito = document.querySelector('#lista-carrito');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');

let articulosCarrito = [];

// Funcion que registra eventos
registrarEventListeners();

function registrarEventListeners() {
    listaCursos.addEventListener('click', cargarCurso);
    carrito.addEventListener('click', eliminarCurso);
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito = [];
        mostrarCarritoHTML();
    })
}

// Funciones
function cargarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        //console.log(cursoSeleccionado);
        leerDatosCurso(cursoSeleccionado);

    }
}

function leerDatosCurso(cursoSeleccionado) {
    const infoCurso = {
        imagen: cursoSeleccionado.querySelector('img').src,
        titulo: cursoSeleccionado.querySelector('h4').textContent,
        precio: cursoSeleccionado.querySelector('.precio span').textContent,
        id: cursoSeleccionado.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };
    // Varificar si el objeto producto ya se encuentra en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    console.log(existe)
    if (existe) {
         const cursos = articulosCarrito.map(curso => {
             if (curso.id === infoCurso.id) {
                 curso.cantidad++;
                 return curso;
             } else {
                 return curso;
             }
         });
         articulosCarrito = [...cursos];
    } else {
        // Agregar el objeto producto al carrito de compras
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    mostrarCarritoHTML();
}

function mostrarCarritoHTML() {
    // LimpiarCarritoHTML
    limpiarCarritoHTML();

    articulosCarrito.forEach(curso => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${curso.imagen}" width="150"><td/>
            <td>${curso.titulo}<td/>
            <td>${curso.precio}<td/>
            <td>${curso.cantidad}<td/>
            <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
        `;
        listaCarrito.appendChild(fila);
    });
}

function limpiarCarritoHTML() {
    //listaCarrito.innerHTML = '';
    while (listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}

function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        mostrarCarritoHTML();
    }
}

