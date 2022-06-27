//Definir variables
const carrito = document.querySelector('#carrito');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
const emailBtn = document.querySelector('#email');
let articulosCarrito = [];

//Crear a funcion de Registrar Eventos
registrarEventListeners();

function registrarEventListeners() {
    //Evento cuando se agregan cursos al carrito de compras
    listaCursos.addEventListener('click', agregarCurso);
    carrito.addEventListener('click', eliminarCurso);
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        localStorage.clear();
        limpiarHTML();
    });
    emailBtn.addEventListener('click', () => {
        actualizarLocalStorage();
    });

}

//Funciones
function agregarCurso(e) {
    e.preventDefault(); //Evita que el enlace se vaya al principio del documento.
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }

}

//Local Storage
function actualizarLocalStorage() {
    localStorage.setItem('articulosCarrito', JSON.stringify(articulosCarrito));
}

//Eliminar Cursos del carrito
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)
        mostrarCarritoHTML();
    }

}

//Leer el curso seleccionado
function leerDatosCurso(cursoSeleccionado) {

    //console.log(cursoSeleccionado);
    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: cursoSeleccionado.querySelector('img').src,
        titulo: cursoSeleccionado.querySelector('h4').textContent,
        precio: cursoSeleccionado.querySelector('.precio span').textContent.slice(1),
        id: cursoSeleccionado.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisar si un producto que seleccionamos ya existe en el carrito
    const existe = articulosCarrito.some(cursoSeleccionado => cursoSeleccionado.id === infoCurso.id);
    if (existe) {
        const cursos = articulosCarrito.map(cursoSeleccionado => {
            if (cursoSeleccionado.id === infoCurso.id) {
                cursoSeleccionado.cantidad++;
            }
            return cursoSeleccionado; //Retonar los objetos que no son duplicados
        });
        articulosCarrito = [...cursos];
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    mostrarCarritoHTML();
}

//Mostrar el carrito de compras en el HTML
function mostrarCarritoHTML() {
    //Limpiar HTML
    limpiarHTML();

    let totalAPagar = 0;

    //Recorrer el carrito con los productos selccionados
    articulosCarrito.forEach(curso => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> <img src="${imagen}" width="170"></td>
            <td> ${titulo}</td>
            <td> ${precio}</td>
            <td> ${cantidad}</td>
            <td> ${cantidad * precio}</td>
            <td> 
                <a href="#" class="borrar-curso" data-id="${id}"> X </a> 
            </td>             
        `;

        totalAPagar += cantidad * precio;
        listaCarrito.appendChild(row);
    })

    const total = document.createElement('tr');
    total.innerHTML = `
        <td><strong>Total a pagar:</strong></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${totalAPagar}</td>
        <td></td>
    `;

    listaCarrito.appendChild(total);
    actualizarLocalStorage();
}

//Limpiar HTML
function limpiarHTML() {
    //Forma lenta
    listaCarrito.innerHTML = '';

    //Forma óptima
    while (listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}