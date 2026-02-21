# 🧊 SpeedCube Tracker

Aplicación para controlar tu progreso aprendiendo los **57 OLL** y **21 PLL** del cubo Rubik 3x3.

## Características

- ✅ Login con Firebase Auth
- ✅ 57 casos OLL con 3 algoritmos cada uno
- ✅ 21 casos PLL con 3 algoritmos cada uno
- ✅ SVGs generados con código (sin dependencias externas)
- ✅ Marcar como aprendido con visual verde elegante
- ✅ Barras de progreso OLL y PLL
- ✅ Filtros por categoría y estado
- ✅ Modo oscuro
- ✅ Responsive (móvil y desktop)
- ✅ Progreso guardado en Firestore + localStorage backup
- ✅ Botón cerrar sesión

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto nuevo (ej: "speedcube-tracker")
3. En **Authentication > Sign-in method**, habilita "Email/Password"
4. En **Authentication > Users**, crea un usuario:
   - Email: `sergiopin2220@gmail.com`
   - Password: `Speedcube`
5. En **Firestore Database**, crea una base de datos en modo test
6. Ve a **Project Settings > General > Your apps > Web app**
7. Copia tu config y pégala en `src/firebase/config.js`

### 3. Ejecutar

```bash
npm run dev
```

### 4. Build para producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── App.jsx                  # Router principal
├── main.jsx                 # Entry point
├── index.css                # Estilos globales + CSS variables
├── components/
│   ├── AlgorithmCard.jsx    # Card de cada caso (expandible)
│   ├── CubeSVG.jsx          # SVG generado para OLL
│   ├── PllSVG.jsx           # SVG generado para PLL
│   ├── Header.jsx           # Header con logo y logout
│   └── ProgressBar.jsx      # Barra de progreso
├── context/
│   └── AuthContext.jsx       # Auth + progreso (Firebase)
├── data/
│   ├── oll.js               # 57 casos OLL
│   └── pll.js               # 21 casos PLL
├── firebase/
│   └── config.js            # Configuración Firebase
└── pages/
    ├── Dashboard.jsx         # Vista principal
    └── LoginPage.jsx         # Página de login
```

## Agregar nuevas secciones (F2L, ZBLL, etc.)

1. Crea el archivo de datos en `src/data/` (ej: `f2l.js`)
2. Agrega la sección en `Dashboard.jsx` (nuevo tab)
3. Agrega el campo en `AuthContext.jsx` (ej: `progress.f2l`)
4. ¡Listo!

## Tech Stack

- React 18 + Vite
- Firebase Auth + Firestore
- CSS custom properties (sin Tailwind ni librerías CSS)
- SVGs generados programáticamente
