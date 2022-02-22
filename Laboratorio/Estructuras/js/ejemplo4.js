let rol = 'ADMIN'

if (rol === 'ADMIN') {
    console.log('El Usuario puede editar, eliminar y ver toda la información')
} else if (rol === 'EDITOR') {
    console.log('El usuario solo puede editar sus registros')
} else if (rol === 'AUTOR') {
    console.log('El usuario solo puede registrar usuarios')
}
else {
    console.log('El Usuario es visitante, solo puede ver la información')
}

