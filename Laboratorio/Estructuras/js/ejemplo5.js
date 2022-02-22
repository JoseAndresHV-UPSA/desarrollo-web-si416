const metodoPago = 'efectivo'

switch (metodoPago) {
    case 'efectivo':
        console.log(`Pagaste con ${metodoPago}`)
        break
    case 'cheque':
        console.log(`Pagaste con ${metodoPago} revisaremos tus fondos primero`)
        break
    case 'tarjeta':
        console.log(`Pagaste con ${metodoPago} espere un momento`)
        break
    default:
        console.log('Aun no has pagado')
        break
}