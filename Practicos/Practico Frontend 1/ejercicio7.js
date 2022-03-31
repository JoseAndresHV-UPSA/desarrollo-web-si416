/*
Crea un array bidimensional para almacenar nombre y calificación de un grupo de asistentes a un curso.
Una vez creado rellenalo con al menos 4 elementos, y luego ordénalos por orden crecientes de las calificaciones.

Por ejemplo: Juan 5, Luisa 7, Ana 4, Pedro 3. Al ordenarlo, debe quedar: Luisa 7, Juan 7, Ana 4, Pedro 3.
 */

const notas = [['Juan', 5], ['Luisa', 7], ['Ana', 4], ['Pedro', 3]];

notas.sort((n1, n2) => {
    if (n1[1] == n2[1]) {
        return 0;
    }
    else {
        return (n1[1] > n2[1]) ? -1 : 1;
    }
});

console.log(notas);