# Digital Future - Enterprise API Management Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

**Plataforma empresarial unificada para gestión de APIs WhatsApp, Twilio Voice/SMS/VoIP y Facebook con integración OpenSIPS + Asterisk VoIP, gestión de extensiones, llamadas recurrentes, PI Key generation, CRM completo, widgets embebibles y panel de administración gráfico.**

## 🚀 Características Principales

### 📱 Módulos Empresariales (15+ Funcionales)
- **API Key Manager Pro** - Gestión segura de claves, auditoría, estadísticas en tiempo real
- **Twilio Voice Module** - SMS, Voice, IVR, grabación de llamadas  
- **Twilio VoIP Pro** - PI Key generation, SIP credentials, integración Asterisk AMI
- **OpenSIPS Server** - Servidor SIP completo integrado con Twilio
- **VoIP Extensions Manager** - Creación y gestión de extensiones VoIP
- **Recurring Calls System** - Programación de llamadas automáticas (daily/weekly/monthly)
- **CRM Pro** - Gestión de contactos, workflow automation, lead tracking
- **Embed Widgets v1.0** - SMS, Voice, WhatsApp, VoIP, CRM widgets (HTML/React)
- **WhatsApp Business** - Mensajería integrada Meta WhatsApp API
- **Facebook Integration** - Sincronización y estadísticas
- **Admin Panel Gráfico** - Panel de control con widgets visuales
- **Overview Dashboard** - Metrics en tiempo real, sincronización cada 5s
- Y más... (80+ endpoints API total)

### 🎨 Diseño "Digital Future"
- Gradientes azul → púrpura → rosa
- Tema oscuro (slate-950/900)
- Dark mode nativo
- Responsive + Mobile-first

### 🔐 Seguridad Enterprise
- Bearer token authentication (API Key Manager)
- Validación de requests con Zod
- Auditoría completa de operaciones
- Manejo seguro de credenciales

### 📊 API REST v1
```
80+ endpoints implementados:
- /api/v1/keys/* - Gestión de claves
- /api/v1/crm/* - Operaciones CRM
- /api/v1/twilio/* - Servicios Twilio
- /api/v1/voip/extensions/* - Gestión de extensiones VoIP
- /api/v1/voip/recurring-calls/* - Llamadas recurrentes
- /api/v1/opensips/* - Control de servidor OpenSIPS
- /api/v1/asterisk/* - Integración Asterisk AMI
- /api/v1/widgets/* - Widget submissions
- /embed/* - Widget scripts
- /api/v1/admin/* - Panel de administración
```

---

## 📋 Requisitos

- **Node.js** 20.0.0+
- **PostgreSQL** 14+ (Neon para Replit)
- **npm** 10+
- Variables de entorno configuradas

## 🛠️ Instalación Local

### 1. Clonar repositorio
```bash
git clone https://github.com/tuusuario/digital-future.git
cd digital-future
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/digital_future
META_WHATSAPP_TOKEN=tu_token_meta
WHATSAPP_PHONE_ID=tu_phone_id
NODE_ENV=development
PORT=5000
```

### 4. Inicializar base de datos
```bash
npm run db:push
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

App disponible en: `http://localhost:5000`

---

## 🚢 Deployment Guide

### ✅ VPS (DigitalOcean, Linode, AWS EC2)

#### Requisitos VPS
- Ubuntu 22.04 LTS (mín 2GB RAM)
- Node.js 20+ instalado
- PostgreSQL 14+
- Nginx reverse proxy

#### Pasos Deploy VPS

**1. SSH a tu servidor**
```bash
ssh root@your_vps_ip
```

**2. Preparar servidor**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 (gestor procesos)
sudo npm install -g pm2
```

**3. Clonar y configurar app**
```bash
cd /var/www
sudo git clone https://github.com/tuusuario/digital-future.git
cd digital-future
sudo chown -R $USER:$USER .

npm install
npm run build
```

**4. Configurar variables de entorno**
```bash
nano .env.production
```
```
DATABASE_URL=postgresql://user:password@localhost:5432/digital_future
META_WHATSAPP_TOKEN=tu_token
WHATSAPP_PHONE_ID=tu_phone_id
NODE_ENV=production
PORT=3000
```

**5. Configurar PostgreSQL**
```bash
sudo -u postgres createdb digital_future
sudo -u postgres createuser app_user
sudo -u postgres psql -c "ALTER USER app_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE digital_future TO app_user;"

# Ejecutar migrations
npm run db:push
```

**6. Configurar PM2**
```bash
pm2 start npm --name "digital-future" -- start
pm2 save
pm2 startup

# Ver estado
pm2 status
```

**7. Configurar Nginx**
```bash
sudo nano /etc/nginx/sites-available/digital-future
```
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**8. Habilitar sitio y SSL**
```bash
sudo ln -s /etc/nginx/sites-available/digital-future /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL con Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

**9. Verificar deploy**
```bash
# Ver logs
pm2 logs digital-future

# Probar endpoint
curl -H "Authorization: Bearer sk_enterprise_demo_key_12345" https://tudominio.com/api/v1/keys
```

---

### ✅ Vercel (Serverless - Recomendado para frontend)

> **Nota**: Vercel es ideal para el frontend React. El backend debe estar en VPS/AWS Lambda.

#### Pasos Deploy Frontend en Vercel

**1. Conectar repositorio**
```bash
npm install -g vercel
vercel login
```

**2. Deploy desde raíz del proyecto**
```bash
vercel --prod
```

**3. Configurar variables de entorno en Vercel Dashboard**
```
VITE_API_URL=https://tu-backend-vps.com/api
```

**4. Build configuration** (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

Frontend en: `https://digital-future.vercel.app`

---

### ✅ AWS (Combinado: EC2 + RDS + ALB)

#### Requisitos AWS
- EC2 instance (t3.medium mín, Ubuntu 22.04)
- RDS PostgreSQL 14
- Application Load Balancer
- Route 53 para DNS
- S3 para backups

#### Pasos Deploy AWS

**1. Crear RDS PostgreSQL**
```
- Engine: PostgreSQL 14
- Instance: db.t3.micro
- Storage: 20GB GP3
- Backup: 7 días
- Multi-AZ: Sí (producción)
```

**2. Crear EC2 instance**
```bash
# Security Group: permitir 80, 443, 22 desde tu IP
# Key pair: descargar digital-future-key.pem

chmod 400 digital-future-key.pem
ssh -i digital-future-key.pem ubuntu@tu-ec2-ip
```

**3. Configurar EC2**
```bash
# Copiar archivo deploy-aws.sh y ejecutar
wget https://raw.githubusercontent.com/tuusuario/digital-future/main/scripts/deploy-aws.sh
chmod +x deploy-aws.sh
./deploy-aws.sh
```

**4. Conectar RDS**
```bash
export DATABASE_URL="postgresql://admin:password@digital-future-db.xxxxx.us-east-1.rds.amazonaws.com:5432/digital_future"
npm run db:push
```

**5. Crear Application Load Balancer**
```
- Target: EC2 instance (puerto 3000)
- SSL: ACM certificate
- DNS: Route 53 CNAME
```

**6. Deploy con GitHub Actions**
```yaml
# .github/workflows/deploy-aws.yml
name: Deploy AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to EC2
        run: |
          npm run build
          aws s3 sync dist/ s3://digital-future-builds/
          ssh -i ${{ secrets.EC2_KEY }} ec2-user@${{ secrets.EC2_HOST }} 'cd /var/www/digital-future && git pull && npm install && npm run build && pm2 restart all'
```

---

## 📝 Variables de Entorno

### Desarrollo (.env.local)
```
DATABASE_URL=postgresql://localhost:5432/digital_future
META_WHATSAPP_TOKEN=test_token
WHATSAPP_PHONE_ID=test_phone_id
NODE_ENV=development
PORT=5000
```

### Producción (.env.production)
```
DATABASE_URL=postgresql://user:pass@prod-db.host:5432/digital_future
META_WHATSAPP_TOKEN=prod_token_from_meta
WHATSAPP_PHONE_ID=prod_phone_id
WHATSAPP_BUSINESS_ACCOUNT_ID=waba_xxxxx
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+18622770131
NODE_ENV=production
PORT=3000
ADMIN_PHONE=+18622770131
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automático)
```bash
# Trigger en push a main
git push origin main

# Actions ejecutados:
1. Lint & Type Check
2. Build & Test
3. Deploy a VPS (via SSH)
4. Smoke tests
5. Slack notification
```

---

## 📊 Monitoreo & Logs

### VPS - PM2 Monitoreo
```bash
pm2 logs digital-future        # Ver logs en vivo
pm2 status                      # Ver estado
pm2 restart digital-future      # Reiniciar
pm2 delete digital-future       # Remover
```

### AWS CloudWatch
```bash
# Ver logs en tiempo real
aws logs tail /aws/ec2/digital-future --follow

# Ver métricas
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --start-time 2025-01-20T00:00:00Z \
  --end-time 2025-01-21T00:00:00Z \
  --period 300
```

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Type checking
npm run check

# Build production
npm run build

# Start production
npm start
```

---

## 🔐 Seguridad Checklist

- ✅ HTTPS/TLS en todos los endpoints
- ✅ API Keys con Bearer token authentication
- ✅ Rate limiting (recomendado: 1000 req/min)
- ✅ CORS configurado para dominios autorizados
- ✅ Secrets en variables de entorno (NO en código)
- ✅ Logs de auditoría de todas las operaciones
- ✅ Database backups automáticos diarios
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ CSRF protection en formularios

---

## 📈 Performance Tips

- Usar CDN (CloudFlare, AWS CloudFront) para assets
- Caché de 1 hora para endpoints GET sin cambios
- Compression (gzip) en Nginx
- Database connection pooling
- Redis para sesiones (opcional)

---

## 🆘 Troubleshooting

### "Connection refused" en VPS
```bash
# Verificar que PM2 está corriendo
pm2 status
pm2 logs digital-future

# Reiniciar
pm2 restart digital-future
```

### Database connection error
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Test conexión
psql $DATABASE_URL -c "SELECT 1;"
```

### CORS errors en frontend
```bash
# Asegurarse que Nginx proxy headers estén configurados
# Ver punto "7. Configurar Nginx" arriba
```

### SSL certificate expired
```bash
sudo certbot renew --dry-run  # Test
sudo certbot renew             # Renovar
```

---

## 📞 Soporte

- **Email**: support@digitalfuture.com
- **Admin Phone**: +18622770131
- **Documentación**: https://docs.digitalfuture.com
- **GitHub Issues**: https://github.com/tuusuario/digital-future/issues

---

## 📄 Licencia

MIT License © 2025 Digital Future

---

## 🎯 Roadmap

- [ ] Autenticación OAuth2/Google
- [ ] 2FA SMS/TOTP
- [ ] Webhooks personalizados
- [ ] Integración Stripe
- [ ] Dashboard analytics avanzada
- [ ] Mobile app nativa
- [ ] Marketplace de integraciones

---

**Versión**: 1.0.0 | **Última actualización**: 2025-01-20 | **Status**: 🟢 Production Ready
