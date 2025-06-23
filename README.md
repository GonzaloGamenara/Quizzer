# 🎮 Quizzer

**Quizzer** es una aplicación web de quizzes interactivos y competitivos que combina lógica de texto, rapidez mental y diversión. A diferencia de los quizzes tradicionales por preguntas, en Quizzer el jugador debe escribir respuestas ocultas hasta descubrir todos los elementos posibles. ¡Perfecto para jugar solo o en modo multijugador con amigos!

---

## 🧠 ¿Cómo funciona?

- Cada quiz tiene una **categoría** (ej. países del mundo, Pokémon, equipos de fútbol, videojuegos...).
- Se presentan espacios visuales ocultos por cada elemento del quiz.
- El jugador escribe en un campo de texto: si acierta, el elemento aparece y suma un punto.
- Se puede jugar con o sin límite de tiempo.
- Se puede invitar hasta 5 amigos para competir en tiempo real (modo multijugador en desarrollo).

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend

- [React 19](https://react.dev)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- CSS Modules

### 🛠️ Backend (en construcción)

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Socket.io (para partidas multijugador en tiempo real)

---

## 📁 Estructura del proyecto

Quizzer/
├── client/ # Frontend con React
│ └── src/
├── server/ # Backend con Node + Express (en desarrollo)
├── README.md
