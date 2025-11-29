ok# APIs Manager: Plataforma Unificada de Gestión y Orquestación de APIs

APIs Manager es un panel de administración integral diseñado para centralizar, gestionar y automatizar las interacciones entre diversos servicios y APIs. La plataforma proporciona una consola unificada para administrar claves de API, exponer y documentar APIs internas, conectar flujos de trabajo entre servicios (como CRM, WhatsApp y Twilio) y gestionar usuarios con roles específicos.

## Concepto del Proyecto

En el ecosistema digital actual, las empresas dependen de una multitud de servicios SaaS y APIs internas para operar. La gestión de estas integraciones puede volverse compleja, fragmentada y difícil de escalar. APIs Manager nace como la solución a este problema, ofreciendo un "centro de comando" unificado que permite a los equipos técnicos y de negocio:

-   **Centralizar la Seguridad**: Gestionar todas las credenciales de API de servicios externos en un único lugar seguro.
-   **Exponer y Monetizar APIs**: Convertir funcionalidades internas en APIs seguras, documentadas y listas para ser consumidas por clientes o socios.
-   **Automatizar Procesos de Negocio**: Crear flujos de trabajo lógicos (sin necesidad de código complejo) que conectan diferentes sistemas, como por ejemplo, registrar un lead en el CRM cuando llega un mensaje de WhatsApp.
-   **Visibilidad y Control**: Monitorear la actividad del sistema, auditar logs y administrar los permisos de acceso de los usuarios a través de un sistema de roles.

## Características Principales

-   **Dashboard Principal**: Ofrece una vista de pájaro de las métricas más importantes, como el tráfico de API, los flujos de trabajo activos y los errores recientes del sistema.
-   **Gestión de API Keys**: Un repositorio centralizado y seguro para almacenar y gestionar las claves de API de servicios integrados como WhatsApp Business, Twilio y sistemas CRM.
-   **API Exhibition Console**: Una herramienta para documentar, proteger y exponer APIs internas, controlando su estado (publicada, borrador, obsoleta) y visibilidad.
-   **Function Connect**: Un potente motor de orquestación que permite crear, gestionar y monitorear flujos de trabajo automatizados entre diferentes servicios. Incluye un asistente de IA para sugerir flujos óptimos.
-   **Logs y Auditoría**: Un registro detallado de todos los eventos del sistema para facilitar la depuración de errores y la auditoría de seguridad.
-   **Gestión de Usuarios y Roles**: Administración de los miembros del equipo, asignando roles (Admin, Manager, Developer, Agent) para controlar el acceso a las diferentes funcionalidades de la plataforma.

## Despliegue en Vercel

Este proyecto está configurado para un despliegue sencillo y rápido en [Vercel](https://vercel.com/).

1.  **Crea un repositorio en Git**: Sube el código de este proyecto a un repositorio de GitHub, GitLab o Bitbucket.
2.  **Importa el proyecto en Vercel**: Desde tu dashboard de Vercel, importa el repositorio que acabas de crear.
3.  **Configuración**: Vercel detectará automáticamente que es un proyecto Next.js y aplicará la configuración de build correcta. No necesitas configurar nada adicional.
4.  **Desplegar**: Haz clic en "Deploy". Vercel se encargará del resto y te proporcionará una URL para tu aplicación en producción.
