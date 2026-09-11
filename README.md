# NestJS App Template

> Backend modular para construir APIs seguras con NestJS, PostgreSQL y TypeORM.

Una base de proyecto pensada para equipos que necesitan arrancar rapido sin sacrificar estructura: autenticacion JWT, autorizacion por permisos, CRUD modular, subida de archivos a Cloudinary, validacion global y seeders idempotentes al iniciar la aplicacion.

## Por que este template

- **Modular por dominio:** cada bounded context mantiene controladores, servicios, DTOs, entidades y seeders cerca de su responsabilidad.
- **Seguro por defecto:** `JwtAuthGuard` es global; las rutas publicas se declaran de forma explicita con `@Public()`.
- **Autorizacion extensible:** los permisos se expresan con `@PreAuthorized()` y se evaluan mediante `PermissionsGuard`.
- **Persistencia pragmatica:** TypeORM + PostgreSQL, entidades cargadas automaticamente y soft delete en la entidad base.
- **Operable desde el primer arranque:** roles, permisos y usuario `SUPER_ADMIN` se inicializan de forma idempotente.
- **Listo para contenedores:** imagen multi-stage basada en Node 22 Alpine.

## Stack

| Capa | Tecnologia |
| --- | --- |
| Runtime | Node.js 22, TypeScript |
| Framework | NestJS 11 |
| API | Express, Swagger |
| Datos | PostgreSQL, TypeORM 0.3 |
| Seguridad | JWT, Passport, bcrypt |
| Archivos | Cloudinary, Multer |
| Validacion | class-validator, class-transformer |
| Calidad | Jest, ESLint, Prettier |
| Package manager | pnpm |

## Requisitos

- Node.js 22 o superior
- pnpm habilitado mediante Corepack
- PostgreSQL accesible desde la aplicacion
- Credenciales de Cloudinary si se utilizaran uploads

Habilita pnpm si tu instalacion aun no lo tiene:

```bash
corepack enable
```

## Inicio local

1. Instala dependencias:

   ```bash
   pnpm install
   ```

2. Crea `.env` en la raiz. Como minimo:

   ```env
   NODE_ENV=develop
   PORT=3000

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=change-me
   DB_NAME=nestjs

   JWT_SECRET=change-me-with-a-long-random-value

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   SUPER_ADMIN_EMAIL=admin@example.com
   SUPER_ADMIN_PASSWORD=change-me
   SUPER_ADMIN_USERNAME=admin
   ```

3. Inicia el servidor en modo desarrollo:

   ```bash
   pnpm start:dev
   ```

La API queda disponible en `http://localhost:3000/api`.

Cuando `NODE_ENV=develop`, Swagger se publica en `http://localhost:3000/docs`.

## Docker

El `docker-compose.yaml` levanta solamente la API y espera una red Docker externa llamada `postgres_network`.

```bash
docker network create postgres_network
docker compose up -d --build
```

El contenedor recibe las variables desde `.env`. Para usar PostgreSQL en otro contenedor, conectalo tambien a `postgres_network` y usa como `DB_HOST` el nombre del servicio, no `localhost`.

La imagen ejecuta esta secuencia durante el build:

```text
pnpm install --frozen-lockfile -> pnpm test -> pnpm build -> pnpm prune --prod
```

## Configuracion

| Variable | Uso |
| --- | --- |
| `NODE_ENV` | `develop` habilita Swagger; `production` desactiva `synchronize` y activa SSL de PostgreSQL. |
| `PORT` | Puerto HTTP de la API. |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexion PostgreSQL. |
| `DB_POOL_MAX`, `DB_POOL_MIN` | Limites del pool de conexiones. |
| `DB_POOL_ACQUIRE_TIMEOUT`, `DB_POOL_IDLE_TIMEOUT` | Timeouts del pool en milisegundos. |
| `JWT_SECRET` | Secreto utilizado para firmar tokens. |
| `CORS_ORIGINS` | Origenes permitidos separados por comas. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Conexion con Cloudinary. |
| `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_USERNAME` | Credenciales del usuario inicial. |

No guardes secretos reales en el repositorio. Usa un gestor de secretos en CI/CD y genera un `JWT_SECRET` aleatorio y largo para cada entorno.

## Inicializacion de datos

Los seeders se ejecutan durante `onApplicationBootstrap`:

1. `PermissionsSeeder` registra los permisos definidos en `src/common/constants/permissions.ts`.
2. `RolesSeeder` registra `SUPER_ADMIN` y `ADMIN` mediante `upsert`.
3. `SuperAdminSeeder` espera explicitamente a `RolesSeeder`, verifica si ya existe un usuario con rol `SUPER_ADMIN` y, si no existe, crea el usuario configurado en `.env` con la contrasena hasheada mediante bcrypt.

El proceso es idempotente. Si ya existe un super-admin, un usuario con el mismo email o username, o faltan las variables del super-admin, el seeder no sobrescribe datos existentes.

> En produccion `synchronize` esta desactivado. Usa migraciones gestionadas para evolucionar el esquema.

## API principal

Todas las rutas usan el prefijo `/api`.

### Auth

| Metodo | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/auth/login` | Publico |
| `POST` | `/auth/signup` | Publico |
| `POST` | `/auth/refresh` | Publico |
| `POST` | `/auth/logout` | Publico |
| `GET` | `/auth/profile` | JWT |
| `PATCH` | `/auth/profile` | JWT |
| `PATCH` | `/auth/profile/password` | JWT |

### Usuarios

| Metodo | Ruta | Acceso |
| --- | --- | --- |
| `GET` | `/users` | Permiso de lectura |
| `GET` | `/users/:id` | Permiso de lectura |
| `POST` | `/users` | Permiso de creacion |
| `PUT` | `/users/:id` | Permiso de actualizacion |
| `DELETE` | `/users/:id` | Permiso de eliminacion |
| `PATCH` | `/users/:id/restore` | Permiso de restauracion |

La lista de usuarios soporta paginacion, busqueda, ordenamiento, filtro por rol, estado bloqueado y registros eliminados.

### Roles y permisos

Los modulos `RoleModule` y `PermissionModule` gestionan el catalogo de roles y permisos. Un usuario `SUPER_ADMIN` supera la comprobacion de permisos; los demas usuarios necesitan que su rol tenga el permiso requerido.

### Uploads

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `POST` | `/uploads` | Sube un archivo |
| `POST` | `/uploads/many` | Sube varios archivos |
| `GET` | `/uploads` | Lista archivos con paginacion |
| `GET` | `/uploads/:id` | Consulta metadata |
| `DELETE` | `/uploads/:id` | Elimina archivo y metadata |

Los tipos MIME permitidos se centralizan en `src/common/constants/mime-types.ts`.

## Arquitectura

```text
src/
├── common/          Contratos, decoradores, parsers, helpers e interceptores compartidos
├── filter/          Filtros globales para errores HTTP y TypeORM
├── integrations/    Adaptadores de infraestructura: crypto, Cloudinary, JWT y TypeORM
├── modules/         Dominios de negocio
│   ├── auth/
│   ├── permission/
│   ├── refresh_token/
│   ├── role/
│   ├── upload/
│   └── user/
├── security/        Guards y estrategia JWT
├── app.module.ts    Composicion de la aplicacion
└── main.ts          Bootstrap HTTP, CORS, pipes, filtros y Swagger
```

### Convenciones de seguridad

- Las contrasenas nunca se persisten en texto plano; `CryptoService` usa bcrypt.
- Los DTOs se validan mediante `ValidationPipe` global con `whitelist` y `forbidNonWhitelisted`.
- Las respuestas de usuario pasan por `UserMapper`, evitando exponer directamente el modelo de persistencia.
- La aplicacion rechaza origenes CORS que no esten en `CORS_ORIGINS`.
- Los endpoints son privados por defecto.

## Scripts

| Comando | Proposito |
| --- | --- |
| `pnpm start:dev` | Desarrollo con watch mode |
| `pnpm start` | Arranque normal |
| `pnpm start:prod` | Ejecuta `dist/main` |
| `pnpm build` | Compila a `dist/` |
| `pnpm test` | Ejecuta tests unitarios |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm test:cov` | Tests con cobertura |
| `pnpm test:e2e` | Tests end-to-end |
| `pnpm lint` | Comprueba ESLint |
| `pnpm lint:fix` | Corrige problemas automaticos de ESLint |
| `pnpm format` | Formatea codigo fuente y tests |

Antes de abrir un pull request:

```bash
pnpm lint
pnpm test -- --runInBand
pnpm build
```

## Produccion

- Define `NODE_ENV=production`.
- No uses `synchronize` para cambios de esquema.
- Protege `.env` y las credenciales de Cloudinary, PostgreSQL y JWT.
- Configura `CORS_ORIGINS` con dominios concretos, nunca con origenes innecesarios.
- Ejecuta la imagen multi-stage generada por el `Dockerfile` con un usuario no root.
- Revisa logs de arranque para confirmar que la conexion a PostgreSQL y los seeders finalizaron correctamente.

## Licencia

El proyecto se distribuye bajo la licencia indicada en [LICENSE.md](LICENSE.md).
