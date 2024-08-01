document.addEventListener('DOMContentLoaded', () => {
    const anchoTablero = 10; // Ancho del tablero
    const altoTablero = 20; // Alto del tablero
    const tableroJuego = document.getElementById('tablero-juego');
    const piezaSiguiente = document.getElementById('pieza-siguiente');
    const puntosDisplay = document.getElementById('puntos');
    const nivelDisplay = document.getElementById('nivel');
    const botonIniciar = document.getElementById('boton-iniciar');
    let cuadrados = [];
    let siguienteCuadrados = [];
    let idTemporizador;
    let puntos = 0;
    let nivel = 1;
    let siguienteAleatorio = 0;

    const colores = [
        'cyan',
        'blue',
        'orange',
        'yellow',
        'green',
        'purple',
        'red'
    ];

    const lTetromino = [
        [1, anchoTablero+1, anchoTablero*2+1, 2],
        [anchoTablero, anchoTablero+1, anchoTablero+2, anchoTablero*2+2],
        [1, anchoTablero+1, anchoTablero*2+1, anchoTablero*2],
        [anchoTablero, anchoTablero*2, anchoTablero*2+1, anchoTablero*2+2]
    ];

    const zTetromino = [
        [0, anchoTablero, anchoTablero+1, anchoTablero*2+1],
        [anchoTablero+1, anchoTablero+2, anchoTablero*2, anchoTablero*2+1],
        [0, anchoTablero, anchoTablero+1, anchoTablero*2+1],
        [anchoTablero+1, anchoTablero+2, anchoTablero*2, anchoTablero*2+1]
    ];

    const tTetromino = [
        [1, anchoTablero, anchoTablero+1, anchoTablero+2],
        [1, anchoTablero+1, anchoTablero+2, anchoTablero*2+1],
        [anchoTablero, anchoTablero+1, anchoTablero+2, anchoTablero*2+1],
        [1, anchoTablero, anchoTablero+1, anchoTablero*2+1]
    ];

    const oTetromino = [
        [0, 1, anchoTablero, anchoTablero+1],
        [0, 1, anchoTablero, anchoTablero+1],
        [0, 1, anchoTablero, anchoTablero+1],
        [0, 1, anchoTablero, anchoTablero+1]
    ];

    const iTetromino = [
        [1, anchoTablero+1, anchoTablero*2+1, anchoTablero*3+1],
        [anchoTablero, anchoTablero+1, anchoTablero+2, anchoTablero+3],
        [1, anchoTablero+1, anchoTablero*2+1, anchoTablero*3+1],
        [anchoTablero, anchoTablero+1, anchoTablero+2, anchoTablero+3]
    ];

    const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let posicionActual = 4;
    let rotacionActual = 0;
    let aleatorio = Math.floor(Math.random() * tetrominos.length);
    let actual = tetrominos[aleatorio][rotacionActual];

    function crearTablero() {
        // Crear los cuadrados del tablero del juego
        for (let i = 0; i < altoTablero * anchoTablero; i++) {
            const cuadrado = document.createElement('div');
            cuadrado.classList.add('cuadrado');
            tableroJuego.appendChild(cuadrado);
            cuadrados.push(cuadrado);
        }
        // Crear la base del tablero del juego
        for (let i = 0; i < anchoTablero; i++) {
            const cuadrado = document.createElement('div');
            cuadrado.classList.add('cuadrado', 'ocupado');
            tableroJuego.appendChild(cuadrado);
            cuadrados.push(cuadrado);
        }
    }

    crearTablero();

    function dibujar() {
        actual.forEach(index => {
            cuadrados[posicionActual + index].classList.add('tetromino');
            cuadrados[posicionActual + index].style.backgroundColor = colores[aleatorio];
        });
    }

    function desdibujar() {
        actual.forEach(index => {
            cuadrados[posicionActual + index].classList.remove('tetromino');
            cuadrados[posicionActual + index].style.backgroundColor = '';
        });
    }

    function moverAbajo() {
        desdibujar();
        posicionActual += anchoTablero;
        dibujar();
        congelar();
    }

    function congelar() {
        if (actual.some(index => cuadrados[posicionActual + index + anchoTablero].classList.contains('ocupado'))) {
            actual.forEach(index => cuadrados[posicionActual + index].classList.add('ocupado'));
            aleatorio = siguienteAleatorio;
            siguienteAleatorio = Math.floor(Math.random() * tetrominos.length);
            actual = tetrominos[aleatorio][rotacionActual];
            posicionActual = 4;
            dibujar();
            mostrarPiezaSiguiente();
            agregarPuntos();
            finJuego();
        }
    }

    function moverIzquierda() {
        desdibujar();
        const enBordeIzquierdo = actual.some(index => (posicionActual + index) % anchoTablero === 0);
        if (!enBordeIzquierdo) posicionActual -= 1;
        if (actual.some(index => cuadrados[posicionActual + index].classList.contains('ocupado'))) {
            posicionActual += 1;
        }
        dibujar();
    }

    function moverDerecha() {
        desdibujar();
        const enBordeDerecho = actual.some(index => (posicionActual + index) % anchoTablero === anchoTablero - 1);
        if (!enBordeDerecho) posicionActual += 1;
        if (actual.some(index => cuadrados[posicionActual + index].classList.contains('ocupado'))) {
            posicionActual -= 1;
        }
        dibujar();
    }

    function rotar() {
        desdibujar();
        rotacionActual++;
        if (rotacionActual === actual.length) {
            rotacionActual = 0;
        }
        actual = tetrominos[aleatorio][rotacionActual];
        dibujar();
    }

    function control(e) {
        if (e.keyCode === 37) {
            moverIzquierda();
        } else if (e.keyCode === 38) {
            rotar();
        } else if (e.keyCode === 39) {
            moverDerecha();
        } else if (e.keyCode === 40) {
            moverAbajo();
        }
    }
    document.addEventListener('keydown', control);

    function mostrarPiezaSiguiente() {
        siguienteCuadrados.forEach(cuadrado => {
            cuadrado.classList.remove('tetromino');
            cuadrado.style.backgroundColor = '';
        });
        tetrominos[siguienteAleatorio][0].forEach(index => {
            siguienteCuadrados[siguienteAleatorio + index].classList.add('tetromino');
            siguienteCuadrados[siguienteAleatorio + index].style.backgroundColor = colores[siguienteAleatorio];
        });
    }

    function agregarPuntos() {
        for (let i = 0; i < 199; i += anchoTablero) {
            const fila = [];
            for (let j = 0; j < anchoTablero; j++) {
                fila.push(i + j);
            }
            if (fila.every(index => cuadrados[index].classList.contains('ocupado'))) {
                puntos += 10;
                puntosDisplay.textContent = puntos;
                fila.forEach(index => {
                    cuadrados[index].classList.remove('ocupado');
                    cuadrados[index].classList.remove('tetromino');
                    cuadrados[index].style.backgroundColor = '';
                });
                const cuadradosRemovidos = cuadrados.splice(i, anchoTablero);
                cuadrados = cuadradosRemovidos.concat(cuadrados);
                cuadrados.forEach(cuadrado => tableroJuego.appendChild(cuadrado));
            }
        }
    }

    function finJuego() {
        if (actual.some(index => cuadrados[posicionActual + index].classList.contains('ocupado'))) {
            puntosDisplay.textContent = 'Fin del Juego';
            clearInterval(idTemporizador);
        }
    }

    function iniciarJuego() {
        dibujar();
        idTemporizador = setInterval(moverAbajo, 1000);
        siguienteAleatorio = Math.floor(Math.random() * tetrominos.length);
        mostrarPiezaSiguiente();
    }

    botonIniciar.addEventListener('click', iniciarJuego);
});
