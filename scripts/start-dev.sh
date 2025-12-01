
#!/bin/bash

echo "🚀 Iniciando aplicación Next.js..."

# Verificar si Next.js está disponible
if [ ! -f "node_modules/.bin/next" ]; then
    echo "⚡ Instalando dependencias necesarias..."
    npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps &
    INSTALL_PID=$!
    
    # Esperar máximo 60 segundos para la instalación
    timeout=60
    elapsed=0
    while [ $elapsed -lt $timeout ]; do
        if [ -f "node_modules/.bin/next" ]; then
            echo "✅ Dependencias instaladas"
            break
        fi
        sleep 2
        elapsed=$((elapsed + 2))
        echo "⏳ Instalando... ($elapsed/$timeout segundos)"
    done
    
    # Si aún no está listo después del timeout, continuar de todos modos
    if [ ! -f "node_modules/.bin/next" ]; then
        echo "⚠️ Instalación en curso, intentando iniciar de todos modos..."
    fi
fi

# Limpiar caché de Next.js si existe
rm -rf .next 2>/dev/null || true

# Iniciar el servidor
echo "🌐 Iniciando servidor en puerto 9002..."
exec npx next dev --turbopack --port 9002 --hostname 0.0.0.0
