# Documentación técnica del proyecto

## Resumen general

Este proyecto es una plantilla backend de **NestJS** construida con **TypeScript**. Está diseñada como una API modular que incluye:

- Autenticación con **JWT**
- Autorización por **roles y permisos**
- Integración con **Cloudinary** para subida de archivos
- Persistencia en **PostgreSQL** mediante **TypeORM**
- Manejo de usuarios, roles, permisos y archivos
- Validaciones básicas de carga de archivos y gestión de datos

## Tecnologías usadas

- Node.js
- TypeScript
- NestJS
- pnpm
- PostgreSQL
- TypeORM
- JSON Web Tokens (JWT)
- Passport JWT
- Bcrypt
- Cloudinary
- class-transformer
- class-validator
- Jest
- ESLint + Prettier
- RxJS

## Archivos principales de configuración

- `package.json` — dependencias, scripts y configuración de Jest
- `tsconfig.json` — configuración de compilación TypeScript
- `nest-cli.json` — configuración de Nest CLI
- `README.md` — guía básica generada por el starter de NestJS
- `pnpm-lock.yaml` — bloqueo de paquetes de pnpm

## Estructura del proyecto

### Raíz

- `src/app.module.ts` — módulo raíz de la aplicación
- `src/app.controller.ts` — controlador de ejemplo
- `src/app.service.ts` — servicio de ejemplo
- `src/main.ts` — punto de entrada de la aplicación

### Common

- `src/common/entity/base.ts` — clase base para entidades con campos comunes (`id`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`)
- `src/common/decorators/profile.ts` — decorador personalizado `@Profile()` para inyectar el usuario autenticado en un controlador
- `src/common/interceptors/upload/upload.interceptor.ts` — interceptor de NestJS para validar tipos de archivo al subir
- `src/common/parser/pagination.parser.ts` — parser para respuesta paginada usando `nestjs-typeorm-paginate`
- `src/common/constants/mime-types.ts` — lista de tipos MIME permitidos para upload
- `src/common/service/crud.service.ts` — interfaz base de servicio CRUD (usada por `UserService`)

### Integraciones

- `src/integrations/crypto/crypto.service.ts` — servicio para encriptar y comparar contraseñas con bcrypt
- `src/integrations/crypto/crypto.module.ts` — módulo de exportación del servicio de crypto
- `src/integrations/cloudinary/cloudinary.service.ts` — servicio wrapper para subir y eliminar archivos en Cloudinary
- `src/integrations/cloudinary/cloudinary.module.ts` — módulo de integración con Cloudinary

### Seguridad y reglas

- `src/security/jwt/jwt.guard.ts` — guard global que valida JWT y permisos de rutas
- `src/security/rules/security.rules.ts` — reglas de seguridad para endpoints públicos y autenticados
- `src/security/security.rules.module.ts` — módulo que exporta `SecurityRules`

### Módulos de dominio

- `src/modules/auth/` — login, registro y perfil de usuario
- `src/modules/user/` — gestión de usuarios CRUD
- `src/modules/role/` — gestión de roles y asociación con permisos
- `src/modules/permission/` — gestión de permisos y seeding
- `src/modules/upload/` — subida y administración de archivos en Cloudinary

## Descripción de módulos y responsabilidades

### `src/app.module.ts`

- Carga `ConfigModule` en modo global para variables de entorno.
- Conecta a PostgreSQL con `TypeOrmModule.forRootAsync`.
- Registra `JwtModule` global usando configuración de `ConfigService`.
- Importa módulos centrales: `CloudinaryModule`, `AuthModule`, `UserModule`, `RoleModule`, `PermissionModule`, `SecurityRulesModule`, `UploadModule`, `UploadInterceptorModule`, `CryptoModule`.
- Declara el guard global `JwtAuthGuard` mediante `APP_GUARD`.

### Autenticación y sesión

#### `AuthModule`

- `AuthController` expone:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
  - `GET /api/auth/profile`
- `AuthService` realiza:
  - login de usuario
  - comparación de contraseña con `CryptoService`
  - creación de usuario con password hasheado
  - generación de token JWT
  - lectura de perfil con roles y permisos

#### `JwtAuthGuard`

- Valida la presencia del header `Authorization: Bearer ...`
- Verifica el token JWT con `JwtService`
- Consulta el usuario activo y detecta cuentas bloqueadas o eliminadas
- Permite rutas públicas definidas en `SecurityRules`
- Permite rutas autenticadas sin permisos especiales (`/api/auth/profile`)
- Verifica permisos contra la ruta y método HTTP del usuario

#### `SecurityRules`

- Define endpoints públicos:
  - `/api/auth/login` [POST]
  - `/api/auth/signup` [POST]
- Define endpoint autenticado:
  - `/api/auth/profile` [GET, PUT]
- Provee normalización de rutas y comprobación de reglas.

### Gestión de usuarios

#### `UserModule`

- Exposición de CRUD de usuarios via `UserController`.
- Control de creación, actualización, eliminación y búsqueda.
- Prevención de acciones contra el propio usuario en rutas sensibles.

#### `UserController`

- `GET /api/users` — lista usuarios con filtros y paginación.
- `GET /api/users/:id` — obtiene usuario por ID.
- `POST /api/users` — crea usuario.
- `PUT /api/users/:id` — actualiza usuario.
- `DELETE /api/users/:id` — elimina usuario.

#### `UserService`

- Usa `nestjs-typeorm-paginate` para paginar resultados.
- Crea y actualiza roles asociados correctamente.
- Implementa métodos CRUD genéricos.

### Roles y permisos

#### `RoleModule`

- `RoleController` y `RoleService` gestionan roles.
- `Role` tiene relación ManyToMany con `Permission`.

#### `PermissionModule`

- `PermissionController` y `PermissionService` gestionan permisos.
- Incluye `PermissionsSeeder` para poblar permisos iniciales.
- Importa `SecurityRulesModule` y `DiscoveryModule`.

#### Entidades principales

- `Role` (`src/modules/role/domain/entities/role.entity.ts`):
  - `name`
  - `description`
  - relación ManyToMany con `Permission`

- `Permission` (`src/modules/permission/domain/entities/permission.entity.ts`):
  - `path`
  - `method`
  - `title`

### Subida de archivos y Cloudinary

#### `UploadModule`

- Gestiona endpoints de subida de archivos.
- Usa interceptor `UploadInterceptor` para validar tipo y existencia.
- Usa `CloudinaryService` para operaciones remotas.

#### `UploadController`

- `POST /api/uploads` — sube un archivo simple.
- `POST /api/uploads/many` — sube múltiples archivos.
- `DELETE /api/uploads/:id` — elimina un archivo.
- `GET /api/uploads/:id` — obtiene metadata de un archivo.
- `GET /api/uploads` — lista archivos con paginación.

#### `UploadService`

- Determina el `resource_type` según el MIME type:
  - imágenes -> `image`
  - video -> `video`
  - PDF -> `raw`
- Guarda metadata de Cloudinary en la entidad `Upload`.
- Elimina el archivo remoto antes de borrar el registro.
- Ofrece búsqueda paginada con `PaginationParser`.

#### `Upload` entity

- Campos almacenados:
  - `publicId`
  - `url`
  - `secureUrl`
  - `resourceType`
  - `format`
  - `originalFilename`
  - `width`, `height`, `bytes`
  - `tags`
  - `placeholder`

#### `UploadInterceptor`

- Valida que exista al menos un archivo.
- Comprueba que el MIME type sea válido usando `allowedMimeTypes`.
- Lanza `BadRequestException` en caso de datos inválidos.

### Integración con Cloudinary

- `CloudinaryModule` carga configuración asíncrona desde `ConfigService`.
- Variables esperadas:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- `CloudinaryService` expone:
  - `upload(filePath, config)`
  - `destroy(public_id)`

### Seguridad de contraseñas

- `CryptoService` usa `bcrypt` con `saltRounds = 10`.
- Métodos:
  - `encrypt(password)`
  - `compare(password, hash)`

### Paginación

- `PaginationParser` transforma la respuesta de `nestjs-typeorm-paginate`.
- `PaginationMeta` normaliza metadata:
  - `page`
  - `pageSize`
  - `pageCount`
  - `total`

## Dependencias definidas en `package.json`

### Dependencias de producción

- `@nestjs/common`
- `@nestjs/config`
- `@nestjs/core`
- `@nestjs/jwt`
- `@nestjs/passport`
- `@nestjs/platform-express`
- `@nestjs/typeorm`
- `typeorm`

### Dependencias de desarrollo

- `@nestjs/cli`
- `@nestjs/schematics`
- `@nestjs/testing`
- `@scwar/nestjs-cloudinary`
- `@types/bcrypt`
- `@types/express`
- `@types/jest`
- `@types/multer`
- `@types/node`
- `@types/supertest`
- `bcrypt`
- `class-transformer`
- `class-validator`
- `eslint`
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `globals`
- `jest`
- `multer`
- `nestjs-typeorm-paginate`
- `passport`
- `passport-jwt`
- `pg`
- `prettier`
- `reflect-metadata`
- `remove`
- `rxjs`
- `source-map-support`
- `supertest`
- `ts-jest`
- `ts-loader`
- `ts-node`
- `tsconfig-paths`
- `typescript`
- `typescript-eslint`

## Scripts disponibles

- `pnpm install`
- `pnpm run build`
- `pnpm run start`
- `pnpm run start:dev`
- `pnpm run start:debug`
- `pnpm run start:prod`
- `pnpm run lint`
- `pnpm run format`
- `pnpm run test`
- `pnpm run test:watch`
- `pnpm run test:cov`
- `pnpm run test:e2e`

## Configuración de TypeScript

- `target`: `ES2023`
- `module`: `nodenext`
- `moduleResolution`: `nodenext`
- `emitDecoratorMetadata`: `true`
- `experimentalDecorators`: `true`
- `declaration`: `true`
- `sourceMap`: `true`
- `outDir`: `./dist`
- `strictNullChecks`: `true`
- `skipLibCheck`: `true`
- `forceConsistentCasingInFileNames`: `true`

## Recomendaciones para desarrolladores

- Revisar el uso de `synchronize: true` en `TypeOrmModule.forRootAsync`; sólo debe usarse en desarrollo.
- Añadir un módulo de configuración `.env.example` y validación de variables.
- Proteger la eliminación de archivos con auditoría si se requiere histórico.
- Añadir validaciones con DTOs usando `class-validator` en los controladores de usuario, rol y permiso.
- Centralizar las rutas de permisos y roles en un servicio de autorización más completo si el proyecto crece.

## Notas importantes

- La seguridad actual depende de la ruta y método exactos en la entidad `Permission`.
- El guard JWT revisa `request.route.path` y compara con reglas de permiso.
- El decorador `@Profile()` asume que el `JwtAuthGuard` ya inyectó `request.user`.
- `UploadInterceptor` usa tipos MIME configurados en `src/common/constants/mime-types.ts`.

## APIs expuestas principales

### Auth

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/profile`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Uploads

- `POST /api/uploads`
- `POST /api/uploads/many`
- `GET /api/uploads`
- `GET /api/uploads/:id`
- `DELETE /api/uploads/:id`

## Conclusión

Este proyecto es una base sólida para un backend de administración de usuarios y archivos con permisos y roles. La documentación contiene la arquitectura principal, las tecnologías usadas, los módulos del dominio y las recomendaciones para desarrolladores.
