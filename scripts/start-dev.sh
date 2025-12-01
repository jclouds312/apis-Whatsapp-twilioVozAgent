
#!/bin/bash

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar si la instalación fue exitosa
if [ ! -f "node_modules/.bin/next" ]; then
    echo "❌ Error: Next.js no está instalado. Reinstalando..."
    rm -rf node_modules package-lock.json
    npm install
fi

# Iniciar el servidor de desarrollo
echo "🚀 Iniciando servidor de desarrollo..."
npx next dev --turbopack --port 9002 --hostname 0.0.0.0
