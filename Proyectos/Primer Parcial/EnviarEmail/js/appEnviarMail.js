//Definición de variables
const enviarBtn = document.querySelector('#enviar');
const resetBtn = document.querySelector('#resetBtn');

//Crear variables para las propiedades
const email = document.querySelector('#email');
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');
const nombre = document.querySelector('#nombre');
const telefono = document.querySelector('#telefono');
const direccion = document.querySelector('#direccion');
const formulario = document.querySelector('#enviar-mail');

let datosMail = {
    email: '',
    asunto: '',
    mensaje: '',
    nombre: '',
    telefono: '',
    direccion:''
}

let mensajeNombre = '';
let mensajeTelefono = '';
let mensajeDireccion = '';
let mensajeCarrito = '';
let mensajeContent = '';
let enviados = [];


const expreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const expregLetras = /^[a-zA-Z\s]*$/;
const expregNumeros = /^[0-9]+$/;
const expregAlphaNumerico = /^[a-zA-Z0-9\s]+$/i

registrarEventListeners();

function registrarEventListeners() {
    //Cuando se inicia la aplicación
    document.addEventListener('DOMContentLoaded', iniciarAplicacion);


    //Campos del formulario
    //El evento blur es disparado cuando un elemento ha perdido su foco
    email.addEventListener('blur', validarFormulario);
    asunto.addEventListener('blur', validarFormulario);
    mensaje.addEventListener('blur', validarFormulario);

    nombre.addEventListener('blur', validarFormulario);
    telefono.addEventListener('blur', validarFormulario);
    direccion.addEventListener('blur', validarFormulario);

    //Resetar formulario
    resetBtn.addEventListener('click', resetarFormulario);

    //Enviar Email
    formulario.addEventListener('submit', enviarEmail);
}


//Funciones
function iniciarAplicacion() {
    enviarBtn.classList.add('cursor-not-allowed', 'opacity-50');
    obtenerCarritoLocalStorage();
}

function obtenerCarritoLocalStorage() {
    let cursos = JSON.parse(localStorage.getItem('articulosCarrito'));
    let total = 0;
    mensajeCarrito += '\nCARRITO DE COMPRA\n'
    if (cursos.length !== 0) {
        cursos.forEach(curso => {
            mensajeCarrito +=
                    `
Id: ${curso.id}
Titulo: ${curso.titulo},
Cantidad: ${curso.cantidad},
Precio: $${curso.precio},
Subtotal: $${curso.cantidad * curso.precio}
`
                total += curso.cantidad * curso.precio;
            }
        );
        mensajeCarrito += `\nTOTAL A PAGAR: $${total}`;
        mensajeContent += mensajeCarrito;
        mensaje.textContent = mensajeContent;
        asunto.value = "Elementos del carrito";
        datosMail.asunto = asunto.value;
        datosMail.mensaje = mensajeCarrito;
    }

}


function validarFormulario(e) {

    //console.log(e.target.type); //Para ver de que tipo son las propiedades (mail, text, textarea, etc.)
    if (e.target.value.length > 0) {
        //Eliminar los errores
        const removerError = document.querySelector('p.error');
        if (removerError) {
            removerError.remove();
        }

        e.target.classList.remove('border', 'border-red-500');
        e.target.classList.add('border', 'border-green-500');

        if (e.target.id === 'asunto') {
            datosMail.asunto = e.target.value;
        }
    } else {
        e.target.classList.remove('border', 'border-green-500');
        e.target.classList.add('border', 'border-red-500');

        mostrarError('Todos los campos son obligatorios!');
    }

    if (e.target.type === 'email' && e.target.value !=='') {

        if (expreg.test(e.target.value)) {
            const removerError = document.querySelector('p.error');
            if (removerError) {
                removerError.remove();
            }

            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');
            datosMail.email = e.target.value;
        } else {

            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');

            mostrarError('Email no valido!');
        }
    }

    if (e.target.id === 'nombre' && e.target.value !=='') {
        if (expregLetras.test(e.target.value)) {
            const removerError = document.querySelector('p.error');
            if (removerError) {
                removerError.remove();
            }

            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');

            datosMail.nombre = e.target.value;
            mensajeNombre = 'Nombre: ' + e.target.value + '\n';

        } else {

            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');

            mensajeNombre = '';
            mostrarError('Nombre no valido! Solo se permite letras');
        }
    }

    if (e.target.id === 'telefono' && e.target.value !=='') {
        if (expregNumeros.test(e.target.value)) {
            const removerError = document.querySelector('p.error');
            if (removerError) {
                removerError.remove();
            }

            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');

            datosMail.telefono = e.target.value;

            mensajeTelefono = 'Telefono: ' + e.target.value + '\n';
        } else {

            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');

            mensajeTelefono = '';
            mostrarError('Telefono no valido! Solo se permite numeros');
        }
    }

    if (e.target.id === 'direccion') {
        if (expregAlphaNumerico.test(e.target.value) && e.target.value !=='') {
            const removerError = document.querySelector('p.error');
            if (removerError) {
                removerError.remove();
            }

            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');


            datosMail.direccion = e.target.value;
            mensajeDireccion = 'Direccion: ' + e.target.value + '\n';
        } else {

            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');

            mensajeDireccion = '';
            mostrarError('Direccion no valida! Solo se permite alfanumericos');
        }
    }

    mensajeContent = mensajeNombre + mensajeTelefono + mensajeDireccion + mensajeCarrito;
    mensaje.textContent = mensajeContent;

    if (expreg.test(email.value) && asunto.value !== '' && mensaje.value !== ''
        && expregLetras.test(nombre.value) && expregNumeros.test(telefono.value)
        &&  expregAlphaNumerico.test(direccion.value)) {

        enviarBtn.classList.remove('cursor-not-allowed', 'opacity-50');

    } else {
        enviarBtn.classList.remove('cursor-not-allowed', 'opacity-50');
        enviarBtn.classList.add('cursor-not-allowed', 'opacity-50');
    }
}``

function mostrarError(mensaje) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = mensaje;

    mensajeError.classList.add('border', 'border-red-500', 'background-red-100', 'text-red-500',
        'p-3', 'mt-5', 'text-center', 'error');

    const errores = document.querySelectorAll('.error');
    if (errores.length === 0) {
        formulario.appendChild(mensajeError);
    }
}

//Funcion enviar Email
function enviarEmail(e) {
    // Guardar copia Objeto

    enviados.push(datosMail);
    console.log(datosMail)

    e.preventDefault();
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'flex';

    //Después de cinco segundos, ocultar el spinner y mostrar el mensaje.
    setTimeout(() => {
        //console.log('Esta funcion se ejecuta despues de cinco segundos!!!');
        spinner.style.display = 'none';

        //Crear un mensaje que se envio correctamente
        const parrafo = document.createElement('p');
        parrafo.textContent = 'El mensaje fue enviado correctamente';
        parrafo.classList.add('text-center', 'my-10', 'p-2', 'bg-green-500', 'text-white', 'font-bold', 'uppercase');

        //Inserta el parrafo antes del spinner
        formulario.insertBefore(parrafo, spinner);

        //Eliminar el mensaje que mostro que el mensaje fue enviado
        setTimeout(() => {
            parrafo.remove();
            resetarFormulario();
        }, 5000)

    }, 5000)


    /*
        setInterval(()=> {
            console.log('Esta funcion se ejecuta despues DE CADA cinco segundos!!!');
        }, 5000);*/
}

//Funcion que resetea el formulario
function resetarFormulario() {
    mensaje.textContent = '';
    formulario.reset();
    iniciarAplicacion();
}
