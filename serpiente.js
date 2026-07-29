// 1. CONFIGURACIÓN E INICIALIZACIÓN
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;

// Variables globales de control
let serpiente = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 }
];

let direccionActual = "derecha"; // PARTE 7: Guarda la dirección
let intervaloSerpiente = null;   // PARTE 6: ID del setInterval
let puntaje = 0;

// PARTE 8: Objeto para almacenar la posición de la comida
let comida = { x: 10, y: 10 };

// Generar primera comida y pintar inicial
generarPosicionComida();
dibujarTodo();

// 2. FUNCIONES DE DIBUJO
// ==========================================
function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTablero() {
  ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function pintarParte(lineaX, lineaY, color = "#ef4444") {
  const x = lineaX * TAMANIO_CELDA;
  const y = lineaY * TAMANIO_CELDA;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);

  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    const color = (i === 0) ? "#facc15" : "#ef4444"; // Cabeza amarilla, cuerpo rojo
    pintarParte(serpiente[i].x, serpiente[i].y, color);
  }
}

// PARTE 8: Pintar comida con color diferente
function pintarComida() {
  pintarParte(comida.x, comida.y, "#38bdf8"); // Azul cian brillante
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarComida();
  pintarSerpiente();
}

// 3. FUNCIONES DE MOVIMIENTO (PARTES 1 y 3)
// ==========================================
function moverDerecha() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x + 1, y: cabeza.y };
  serpiente.unshift(nuevaCabeza); // Agrega nueva cabeza al inicio[cite: 4]
  serpiente.pop();                // Elimina el último segmento[cite: 4]
}

function moverIzquierda() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x - 1, y: cabeza.y };
  serpiente.unshift(nuevaCabeza);
  serpiente.pop();
}

function moverArriba() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x, y: cabeza.y - 1 };
  serpiente.unshift(nuevaCabeza);
  serpiente.pop();
}

function moverAbajo() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x, y: cabeza.y + 1 };
  serpiente.unshift(nuevaCabeza);
  serpiente.pop();
}

// 4. DIRECCIÓN Y CONTROL AUTOMÁTICO (PARTES 2, 4, 5, 6, 7)[cite: 4]
// ==========================================

// PARTE 2 y 7: Actualiza únicamente la dirección seleccionada[cite: 4]
function cambiarDireccion(direccion) {
  // Evitamos que dé la vuelta de 180° sobre sí misma
  if (direccion === "derecha" && direccionActual !== "izquierda") direccionActual = "derecha";
  if (direccion === "izquierda" && direccionActual !== "derecha") direccionActual = "izquierda";
  if (direccion === "arriba" && direccionActual !== "abajo") direccionActual = "arriba";
  if (direccion === "abajo" && direccionActual !== "arriba") direccionActual = "abajo";
}

// PARTE 5, 7 y 10: Función ejecutada repetidamente por el intervalo[cite: 4]
function moverSerpiente() {
  // Mover en la dirección actual
  if (direccionActual === "derecha") moverDerecha();
  if (direccionActual === "izquierda") moverIzquierda();
  if (direccionActual === "arriba") moverArriba();
  if (direccionActual === "abajo") moverAbajo();

  // PARTE 10: Comprobar si atrapó la comida[cite: 4]
  if (atrapaComida()) {
    // a. Incrementar puntaje[cite: 4]
    puntaje += 10;
    document.getElementById("puntaje").innerText = puntaje;

    // b. Hacer crecer la serpiente (agregar segmento según dirección actual)[cite: 4]
    const cola = serpiente[serpiente.length - 1];
    let nuevoSegmento = { x: cola.x, y: cola.y };

    if (direccionActual === "derecha") nuevoSegmento.x -= 1;
    if (direccionActual === "izquierda") nuevoSegmento.x += 1;
    if (direccionActual === "arriba") nuevoSegmento.y += 1;
    if (direccionActual === "abajo") nuevoSegmento.y -= 1;

    serpiente.push(nuevoSegmento);

    // Generar nueva comida[cite: 4]
    generarPosicionComida();
  }

  // Volver a renderizar
  dibujarTodo();
}

// PARTE 4 y 5: Iniciar el intervalo[cite: 4]
function iniciarJuego() {
  if (intervaloSerpiente) return; // Evita crear múltiples intervalos
  document.getElementById("estado").innerText = "Jugando";
  document.getElementById("mensaje").innerText = "¡Sigue así!";
  intervaloSerpiente = setInterval(moverSerpiente, 300); // 300ms para velocidad fluida
}

// PARTE 4 y 6: Pausar el intervalo[cite: 4]
function pausarJuego() {
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
  document.getElementById("estado").innerText = "Pausado";
  document.getElementById("mensaje").innerText = "Juego en pausa.";
}

function reiniciarJuego() {
  pausarJuego();
  serpiente = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];
  direccionActual = "derecha";
  puntaje = 0;
  document.getElementById("puntaje").innerText = puntaje;
  document.getElementById("estado").innerText = "Listo";
  document.getElementById("mensaje").innerText = "Presiona iniciar para comenzar.";
  generarPosicionComida();
  dibujarTodo();
}

// 5. COMIDA Y COLISIONES (PARTES 8 y 9)[cite: 4]
// ==========================================

// PARTE 8: Posición aleatoria dentro del grid[cite: 4]
function generarPosicionComida() {
  const lineasHorizontales = canvas.width / TAMANIO_CELDA;
  const lineasVerticales = canvas.height / TAMANIO_CELDA;

  comida = {
    x: Math.floor(Math.random() * lineasHorizontales),
    y: Math.floor(Math.random() * lineasVerticales)
  };
}

// PARTE 9: Retorna true si la cabeza toca la comida[cite: 4]
function atrapaComida() {
  const cabeza = serpiente[0];
  return cabeza.x === comida.x && cabeza.y === comida.y;
}