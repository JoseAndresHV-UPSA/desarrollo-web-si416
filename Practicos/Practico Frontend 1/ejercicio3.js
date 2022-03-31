/*
En este script deberás crear un array para guardar los nombres de los días de la semana, empezando por 0 para el domingo.
Para comprobar el funcionamiento pide al usuario un número entre 0 y 6 y devuelve el nombre del día.
Se supone que el dato tecleado estará entre 0 y 6.

Si digito el número 4 me deberá decir que el día de la semana es jueves.
 */

const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

function verificarDia(n) {
    if (n >= 0 && n <=6) {
        console.log(`El dia de la semana es ${dias[n]}`);
    }
    else {
        console.log('Dia no encontrado');
    }
}

verificarDia(4);