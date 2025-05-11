# Evaluación Backend - API de Usuarios

¡Hola! Soy Ezequiel Martínez y te presento mi proyecto de API REST para gestionar usuarios. Este proyecto lo hice con NestJS y es el resultado de mucho esfuerzo y aprendizaje. Aquí podrás ver cómo implementé operaciones CRUD, validaciones, roles de acceso con Guards, documentación interactiva con Swagger, pruebas unitarias y E2E.

## ¿Qué hay en este proyecto?

- **CRUD completo:** Podés crear, leer, actualizar y borrar usuarios.
- **Validaciones y Seguridad:** Uso DTOs para validar datos y un RolesGuard para asegurar que solo quien tenga permisos (admin) pueda realizar acciones importantes.
- **Swagger al rescate:** Documenté toda la API con Swagger para que puedas verla, probarla y saber exactamente qué hace cada endpoint.
- **Pruebas:** Cuenta con pruebas unitarias y E2E para que todo funcione como debe.
- **Docker:** La app está lista para correr en un contenedor.

## 📁 Estructura del Proyecto
├── src/
│   ├── users/
│   │   ├── controllers/
|   |   |       └── users.controller.ts
│   │   ├── dtos/
|   |   |      ├── create-user.dto.ts
|   |   |      └── update-user.dto.ts
│   │   ├── guards/
|   |   |      └── roles.guard.ts
│   │   ├── schemas/
|   |   |      └── user.schema.ts
│   │   └── services/
|   |          └── users.service.ts
|   |
│   ├── users.module.ts
├── dockerfile
├── docker-compose.yml
├── package.json
└── README.md
└── main.ts

## Tecnologías que usé

- **Node.js** & **TypeScript**
- **NestJS**
- **Mongoose** para la conexión con MongoDB
- **Swagger** con `@nestjs/swagger` y `swagger-ui-express`
- **Jest** para las pruebas
- **Docker** para hacer todo portable

## Requisitos

- Node.js (versión 14 o superior)
- NPM o Yarn (para instalar las dependencias)
- (Opcional) Docker y Docker Compose si querés correrla en contenedor

## Empezando

### 1. Clonar el repositorio

Primero, cloná el proyecto a tu máquina:

```bash
git clone https://github.com/MartinezEzequielG/NestJSBackendTest.git

cd tu-repositorio

-Con el proyecto clonado, instalá las dependencias ejecutando:

npm install

-Ejecutar el servidor en modo desarrollo:

npm run start:dev

Acceder a la API en: http://localhost:3000 para USERS http://localhost:3000/users/ 

se puede acceder al Swagger UI atravez de http://localhost:3000/api

Ejemplos de endpoints

Crear usuario (POST /users): Envía un objeto JSON con la estructura del CreateUserDto.

Obtener todos los usuarios (GET /users): Puedes agregar un parámetro de consulta para filtrar resultados (ej. ?filter=Nombre).

Actualizar usuario (PUT /users/:id): Este endpoint requiere el header x-user-role: admin para autorizar la operación. Puedes ver la documentación en Swagger para más detalles.

Eliminar usuario (DELETE /users/:id): Se requiere autorización similar al endpoint de actualización.
```

## DOCKER

El repositorio incluye un archivo docker-compose.yml que orquesta la aplicación junto con MongoDB. Para levantar ambos contenedores, ejecuta:

docker-compose up --build

Con esto:

La aplicación correrá en el puerto 3000.

MongoDB se levantará en el puerto 27017.

## Ejecución de Pruebas

Para ejecutar la suite de tests

npm run test

npm run test:watch ( con esta observamos los cambios )

## La aplicación está diseñada para funcionar tanto en entorno local (con MongoDB instalado) como en contenedores Docker.

## La documentación interactiva con Swagger está disponible en la ruta /api.

## Los tests garantizan la calidad del código y el correcto funcionamiento de los endpoints.

## Se han aplicado las mejores prácticas de NestJS, Mongoose y desarrollo de APIs.

¡Gracias por la oportunidad y tomarse el tiempo de revisar mi proyecto!

Saludos, Ezequiel Martínez