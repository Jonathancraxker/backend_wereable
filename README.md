# Backend (API REST)

Este repositorio contiene el módulo backend desarrollado en Node.js diseñado para dar soporte multiplataforma. Proporciona los servicios necesarios para la aplicación frontend de dispositivos wearables y funciona en paralelo como la API proveedora de contenido para la plataforma web de Doriga noticias que se encuentra en el repositorio: https://github.com/Jonathancraxker/doriga_news.git. Se implementó autenticación segura mediante PIN y credenciales (con hash bcrypt), generación y validación de tokens JWT, y la entrega de flujos de noticias protegidos.

---

## Requisitos Previos

Antes de inicializar el proyecto, asegúrate de contar con el siguiente entorno configurado en tu sistema:

1. **Entorno de Ejecución:** Node.js (versión 22.22.0).
2. **Base de Datos:** Gestor de base de datos activo y configurado (las credenciales se administran en las variables de entorno).
3. **Cliente de pruebas (opcional):** Postman, Insomnia o extensión Thunder Client para la verificación independiente de los endpoints.
4. **Repositorio Frontend:** Si necesitas enlazar el widget ejecutable en Flutter, el repositorio se encuentra en: https://github.com/Jonathancraxker/widget_wereable.git.

---

## Instrucciones de inicialización y ejecución

Sigue estos pasos en tu terminal para clonar el repositorio, configurar el entorno y desplegar la API local:

### 1. Clonar el repositorio y acceder al proyecto
Abre tu terminal, descarga el código fuente del backend en tu máquina local:
```bash
git clone [https://github.com/Jonathancraxker/backend_wereable.git](https://github.com/Jonathancraxker/backend_wereable.git)
cd
```

## 2. Entra al proyecto
```bash
cd backend_wereable
```

## 3. Instalación de Dependencias
```bash
npm install
```

## 4. Ingresa tus variables de entorno en el archivo correspondiente

## 5. Inicializa el servidor
```bash
npm run dev
```