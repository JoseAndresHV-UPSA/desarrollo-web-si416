//Variables
btnEnviar = document.querySelector('#enviar');
formulario = document.querySelector('#enviar-mail');
btnReset = document.querySelector('#resetBtn');

//Variables del formulario
const email = document.querySelector('#email');
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');

//Eventos
registroEventListener();
function registroEventListener(){
    document.addEventListener('DOMContentLoaded',iniciarAplicacion);
    email.addEventListener('blur', validarFormulario);
    asunto.addEventListener('blur', validarFormulario);
    mensaje.addEventListener('blur', validarFormulario);
    formulario.addEventListener('submit', enviarMail);
    btnReset.addEventListener('click', resetearFormulario);
}

//Funciones
function iniciarAplicacion(){
    btnEnviar.disable = true;
    btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
}

function validarFormulario(e){
    console.log('Validando Formulario');
    console.log(e.target.value);
    if(e.target.value.length>0){
        const removerError = document.querySelector('p.error')
        if (removerError){
            removerError.remove();
        }
        e.target.classList.remove('border', 'border-red-500');
        e.target.classList.add('border', 'border-green-500');
        console.log("Tiene datos");
    }
    else{
        e.target.classList.remove('border', 'border-green-500');
        e.target.classList.add('border', 'border-red-500');
        btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
        mostrarError('Todos Los Campos Son Obligatorios');
    }
    const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(e.target.type === 'email'){
        if(er.test(e.target.value)){
            console.log('Mail valido');
            if(e.target.value.length>0){
                const removerError = document.querySelector('p.error')
                if (removerError){
                    removerError.remove();
                }
                e.target.classList.remove('border', 'border-red-500');
                e.target.classList.add('border', 'border-green-500');
            }
        }
        else{
            console.log('Mail invalido');
            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');
            btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
            mostrarError('Mail no valido');
        }
    }
    if (er.test(email.value) && asunto.value !== '' && mensaje.value) {
        btnEnviar.disable = false;
        btnEnviar.classList.remove('cursor-not-allowed', 'opacity-50');
    }
}
function mostrarError(mensaje){
    console.log('Error....!!!');
    const mensajeError = document.createElement('p');
    mensajeError.textContent = mensaje
    mensajeError.classList.add('border', 'border-red-500', 'background-red-500',
        'text-center', 'text-red-500', 'p-3', 'mt-5','error');
    const errores = document.querySelectorAll('.error');
    if (errores.length === 0){
        formulario.appendChild(mensajeError);
    }
}

function enviarMail(e) {
    e.preventDefault();
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'flex';
    setTimeout(() => {
        spinner.style.display = 'none';
        const parrafo = document.createElement('p');
        parrafo.textContent = 'El Mail fue enviado de manera correcta';
        parrafo.classList.add('p-3', 'my-10', 'bg-green-500', 'text-white', 'uppercase');
        formulario.insertBefore(parrafo, spinner);
        setTimeout( () => {
            parrafo.remove();
            resetearFormulario();
        }, 4000)
    }, 3000)
}

function resetearFormulario(e) {
    formulario.reset();
    iniciarAplicacion();
    e.preventDefault();
}

