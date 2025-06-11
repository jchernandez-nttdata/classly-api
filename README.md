# 📡 Classly API

API desarrollada con [NestJS](https://nestjs.com), un framework progresivo para construir aplicaciones del lado del servidor con Node.js y TypeScript.

> 🚧 Esta API se conecta a una base de datos **remota de desarrollo**, y sirve como backend para la app **Classly**.

---

## 🚀 Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- MySQL (remoto)

---

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jchernandez-nttdata/classly-api.git

# Instalar dependencias
yarn install
```

## Ejecución
```bash
# Modo desarrollo
yarn start:dev
```

## Cambiar la base de datos utilizada

Para utilizar otra base de datos en este proyecto, sigue estos pasos:

1. Abre el archivo `AppModule` ubicado en `src/app.module.ts`.
2. Busca la configuración de `TypeOrmModule.forRoot`.
3. Actualiza los siguientes campos con los datos de tu nueva base de datos:
   - `host`: dirección del servidor de base de datos.
   - `port`: puerto de conexión (por defecto MySQL usa `3306`).
   - `username`: nombre de usuario de la base de datos.
   - `password`: contraseña del usuario.
   - `database`: nombre de la base de datos.
4. Asegúrate de que tu base de datos tenga acceso remoto habilitado (si aplica).
5. *(Opcional)* Si no deseas que se sincronicen los esquemas automáticamente, cambia `synchronize` a `false` y utiliza migraciones con TypeORM.

> ⚠️ Actualmente el proyecto está conectado a una base de datos remota de desarrollo. Si deseas trabajar localmente, deberás levantar tu propia instancia de MySQL.
