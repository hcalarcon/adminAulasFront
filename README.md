# AdminAulas

AdminAulas es una plataforma web diseñada para facilitar la gestión integral de aulas, tanto para profesores como para alumnos. Ofrece funcionalidades como asistencia, incentivos con moneda virtual (epetcoins), historial de participación y visualización personalizada según el rol del usuario.

## 🚀 Características principales

- **Toma de asistencia:** Registro de presente, ausente o tarde.
- **Cálculo de porcentaje de asistencia:** Visualización clara por colores.
- **Sistema de incentivos:** Los profesores pueden activar una moneda virtual personalizada (epetcoin) y asignarla a sus alumnos.
- **Gestión por tipo de aula:**
  - _Aulas teóricas:_ Toda la clase cursa junta.
  - _Aulas taller:_ Los alumnos se dividen en grupos con diferentes días de cursada.
- **Historial de asistencia y epetcoins:** Por materia y por alumno.
- **Autenticación:** Basada en JWT.
- **Tematización:** Utilizando React Native Paper.

## 👥 Roles

### Profesores

- Visualizan todas las aulas donde dictan clases.
- Pueden tomar asistencia según la modalidad del aula (general o por grupo).
- Activan una epetcoin personalizada para asignar a sus estudiantes.
- Visualizan el historial de asignaciones de monedas y asistencia.

### Alumnos

- Visualizan las materias en las que están inscriptos.
- Consultan su porcentaje de asistencia (con tarjetas que cambian de color).
- Revisan detalle por clase: presente, ausente, tarde o sin clase aún.
- Consultan el historial de asignación de epetcoins.

## 🧱 Tecnologías

| Parte         | Tecnología                              |
| ------------- | --------------------------------------- |
| Frontend      | React Native (orientado a Web) + Vercel |
| Backend       | FastAPI + Render                        |
| Base de datos | PostgreSQL + Supabase                   |
| Autenticación | JWT                                     |
| UI            | React Native Paper                      |

---

¡Con AdminAulas, la gestión de clases es más simple, visual y motivadora para toda la comunidad educativa!

## 💻 Frontend (React Native Web)

Para comenzar con el frontend:

```bash
git clone https://github.com/hcalarcon/adminaulasfront.git
cd frontend-adminaulas
```

Instala las dependencias:

```bash
npm install
```

Ejecuta el proyecto en modo web:

```bash
npm run web
```

## 📈 Roadmap

- Asistencia por grupo o aula.
- Moneda virtual (epetcoin).
- JWT y manejo de usuarios.
- Rankings de alumnos.
- Gestión de notas (trabajos, tareas, exámenes).
- Versión móvil en Play Store y App Store.

## 🤝 Contribuir

¡Toda colaboración es bienvenida! Si encontrás un bug o querés sumar funcionalidades:

1. Realizá un fork del repositorio.
2. Creá una nueva rama.
3. Hacé los cambios necesarios.
4. Enviá un Pull Request 🚀
