
#!/bin/bash

set -e

echo "🔍 Verificando estado del proyecto..."

# Función para limpiar procesos de npm que puedan estar bloqueando
cleanup_npm() {
    echo "🧹 Limpiando procesos de npm anteriores..."
    pkill -9 node || true
    pkill -9 npm || true
    sleep 2
}

# Limpiar procesos anteriores
cleanup_npm

# Verificar si node_modules existe y tiene contenido
if [ ! -d "node_modules" ] || [ ! -d "node_modules/.bin" ]; then
    echo "📦 Instalando dependencias desde cero..."
    rm -rf node_modules package-lock.json .next || true
    npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund
else
    echo "✅ Dependencias ya instaladas"
fi

# Verificar que Next.js esté instalado correctamente
if [ ! -f "node_modules/.bin/next" ]; then
    echo "❌ Next.js no encontrado, reinstalando todo..."
    rm -rf node_modules package-lock.json .next
    npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund
fi

# Limpiar caché de Next.js
echo "🗑️ Limpiando caché de Next.js..."
rm -rf .next || true

# Iniciar el servidor de desarrollo
echo "🚀 Iniciando servidor de desarrollo en puerto 9002..."
NODE_ENV=development npm run dev
