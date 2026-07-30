// ==========================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN
// ==========================================
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;

// Variables globales de juego
let serpiente = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 }
];

let direccionActual = "derecha";
let siguienteDireccion = "derecha"; // Evita giros dobles rápidos en un mismo tick
let intervaloSerpiente = null;
let puntaje = 0;
let nivel = 1;

// ACTIVIDAD 3: Variable para controlar la velocidad (en ms)
let velocidad = 300; 

let comida = { x: 10, y: 10 };
let juegoTerminado = false;

// Inicialización
generarPosicionComida();
dibujarTodo();

// Escuchar teclas del teclado (Mejora de experiencia de usuario)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") cambiarDireccion("arriba");
  if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") cambiarDireccion("abajo");
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") cambiarDireccion("izquierda");
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") cambiarDireccion("derecha");
});

// ==========================================
// 2. FUNCIONES DE DIBUJO
// ==========================================
function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTablero() {
  ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
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
    const color = (i === 0) ? "#facc15" : "#22c55e"; // Cabeza amarilla, cuerpo verde
    pintarParte(serpiente[i].x, serpiente[i].y, color);
  }
}

function pintarComida() {
  pintarParte(comida.x, comida.y, "#38bdf8"); // Comida cian
}

// ACTIVIDAD 1: Cartel visual de GAME OVER en Canvas
function dibujarGameOver() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "16px Arial";
  ctx.fillText("Presiona 'Reiniciar' para intentar de nuevo", canvas.width / 2, canvas.height / 2 + 30);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarComida();
  pintarSerpiente();

  if (juegoTerminado) {
    dibujarGameOver();
  }
}

// ==========================================
// 3. LÓGICA DE MOVIMIENTO
// ==========================================
function moverDerecha() {
  const cabeza = serpiente[0];
  serpiente.unshift({ x: cabeza.x + 1, y: cabeza.y });
  serpiente.pop();
}

function moverIzquierda() {
  const cabeza = serpiente[0];
  serpiente.unshift({ x: cabeza.x - 1, y: cabeza.y });
  serpiente.pop();
}

function moverArriba() {
  const cabeza = serpiente[0];
  serpiente.unshift({ x: cabeza.x, y: cabeza.y - 1 });
  serpiente.pop();
}

function moverAbajo() {
  const cabeza = serpiente[0];
  serpiente.unshift({ x: cabeza.x, y: cabeza.y + 1 });
  serpiente.pop();
}

// ACTIVIDAD 4 (MEJORA): Bloqueo de giros de 180°
function cambiarDireccion(direccion) {
  if (direccion === "derecha" && direccionActual !== "izquierda") siguienteDireccion = "derecha";
  if (direccion === "izquierda" && direccionActual !== "derecha") siguienteDireccion = "izquierda";
  if (direccion === "arriba" && direccionActual !== "abajo") siguienteDireccion = "arriba";
  if (direccion === "abajo" && direccionActual !== "arriba") siguienteDireccion = "abajo";
}

// ==========================================
// 4. COLISIONES Y GAME OVER (ACTIVIDADES 1 y 4)
// ==========================================
function verificarColisiones() {
  // Guarda las coordenadas x e y de la cabeza (el primer elemento del arreglo)
  const cabeza = serpiente[0];

  // Calcula cuántas celdas caben a lo ancho (ej. 500px / 25px = 20 celdas)
  const maxColumnas = canvas.width / TAMANIO_CELDA;

  // Calcula cuántas celdas caben a lo alto
  const maxFilas = canvas.height / TAMANIO_CELDA;

  // 1. EVALUAR BORDES: Revisa si la cabeza se salió por la izquierda, derecha, arriba o abajo
  const colisionBorde = (
    cabeza.x < 0 ||               // ¿Se salió por la izquierda?
    cabeza.x >= maxColumnas ||    // ¿Se salió por la derecha?
    cabeza.y < 0 ||               // ¿Se salió por arriba?
    cabeza.y >= maxFilas          // ¿Se salió por abajo?
  );

  // 2. EVALUAR AUTOCOLISIÓN: Revisa si la cabeza tocó alguna parte de su propio cuerpo
  let colisionCuerpo = false;

  // Empezamos el bucle en i = 1 (el segundo segmento) para no comparar la cabeza consigo misma
  for (let i = 1; i < serpiente.length; i++) {
    // Si la posición de la cabeza coincide con la de alguna parte del cuerpo...
    if (cabeza.x === serpiente[i].x && cabeza.y === serpiente[i].y) {
      colisionCuerpo = true; // Se detecta autocolisión
      break;                 // Rompemos el bucle porque ya sabemos que chocó
    }
  }

  // Retorna true si ocurrió cualquiera de los dos tipos de choques
  return colisionBorde || colisionCuerpo;
}

// ==========================================
// 5. CICLO PRINCIPAL Y VELOCIDAD (ACTIVIDAD 3)
// ==========================================
function moverSerpiente() {
  if (juegoTerminado) return;

  direccionActual = siguienteDireccion;
  
  if (direccionActual === "derecha") moverDerecha();
  if (direccionActual === "izquierda") moverIzquierda();
  if (direccionActual === "arriba") moverArriba();
  if (direccionActual === "abajo") moverAbajo();

  // Validar si perdió
  if (verificarColisiones()) {
    juegoTerminado = true;
    pausarJuego();
    document.getElementById("estado").innerText = "Game Over";
    document.getElementById("mensaje").innerText = "¡Has chocado! Reinicia para volver a jugar.";
    dibujarTodo();
    return;
  }

  // Validar si comió
  if (atrapaComida()) {
    puntaje += 10;
    document.getElementById("puntaje").innerText = puntaje;

    // Crecer la serpiente
    const cola = serpiente[serpiente.length - 1];
    serpiente.push({ x: cola.x, y: cola.y });

    // ACTIVIDAD 3 & 4 (MEJORA): Sistema de aumento de velocidad por Nivel
    if (puntaje % 30 === 0 && velocidad > 80) {
      velocidad -= 40; // Aumenta la velocidad reduciendo el tiempo de repetición
      nivel++;
      document.getElementById("mensaje").innerText = `¡NIVEL ${nivel}! Velocidad aumentada.`;
      
      // Reiniciar el intervalo con la nueva velocidad
      clearInterval(intervaloSerpiente);
      intervaloSerpiente = setInterval(moverSerpiente, velocidad);
    }

    generarPosicionComida();
  }

  dibujarTodo();
}

function iniciarJuego() {
  if (intervaloSerpiente || juegoTerminado) return;
  document.getElementById("estado").innerText = "Jugando";
  document.getElementById("mensaje").innerText = "¡En marcha!";
  intervaloSerpiente = setInterval(moverSerpiente, velocidad); // Usa la variable velocidad
}

function pausarJuego() {
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
  if (!juegoTerminado) {
    document.getElementById("estado").innerText = "Pausado";
    document.getElementById("mensaje").innerText = "Juego pausado.";
  }
}

// ACTIVIDAD 2: Botón Reiniciar Juego
function reiniciarJuego() {
  pausarJuego();
  
  // Restablecer estados
  serpiente = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];
  direccionActual = "derecha";
  siguienteDireccion = "derecha";
  puntaje = 0;
  nivel = 1;
  velocidad = 300; // Reset a velocidad inicial
  juegoTerminado = false; // Reset de Game Over

  document.getElementById("puntaje").innerText = puntaje;
  document.getElementById("estado").innerText = "Listo";
  document.getElementById("mensaje").innerText = "Presiona iniciar para comenzar.";

  generarPosicionComida();
  dibujarTodo();
}

// ==========================================
// 6. COMIDA
// ==========================================
function generarPosicionComida() {
  const maxCols = canvas.width / TAMANIO_CELDA;
  const maxFilas = canvas.height / TAMANIO_CELDA;

  comida = {
    x: Math.floor(Math.random() * maxCols),
    y: Math.floor(Math.random() * maxFilas)
  };
}

function atrapaComida() {
  const cabeza = serpiente[0];
  return cabeza.x === comida.x && cabeza.y === comida.y;
}