# Groq LLM para Google Sheets

Interfaz completa para ejecutar modelos LLM de Groq desde Google Sheets.

## 🚀 Características

- ✅ Panel lateral interactivo
- ✅ Función personalizada para usar en fórmulas: `=GROQ("pregunta")`
- ✅ Múltiples modelos disponibles (Llama 3.3, Mixtral, Gemma)
- ✅ Control de temperatura
- ✅ Ejecución directa en celdas
- ✅ API Key segura almacenada en propiedades de usuario

## 📋 Instalación

### 1. Obtener API Key de Groq

1. Ve a [https://console.groq.com](https://console.groq.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" y genera una nueva clave
4. Copia tu API Key

### 2. Configurar en Google Sheets

1. Sube los archivos al proyecto usando `clasp push`
2. Abre tu Google Sheet
3. Recarga la página
4. Verás un nuevo menú "🤖 Groq LLM"
5. Ve a **Groq LLM → Configurar API Key**
6. Pega tu API Key

## 💡 Formas de Uso

### Opción 1: Panel Lateral

1. Ve a **Groq LLM → Abrir Panel**
2. Selecciona el modelo
3. Ajusta la temperatura (0 = más preciso, 2 = más creativo)
4. Escribe tu pregunta
5. Click en "Ejecutar"
6. Usa **Ctrl+Enter** como atajo

### Opción 2: Función en Fórmulas

En cualquier celda, escribe:

```excel
=GROQ("¿Cuál es la capital de Francia?")
```

Con parámetros opcionales:

```excel
=GROQ("Escribe un poema", "llama-3.3-70b-versatile", 1.2)
```

### Opción 3: Ejecutar en Celda

1. Escribe tu pregunta en una celda
2. Selecciona esa celda
3. Ve a **Groq LLM → Ejecutar en celda seleccionada**
4. La respuesta aparecerá en la celda de al lado

## 🤖 Modelos Disponibles

| Modelo | ID | Descripción |
|--------|-----|-------------|
| **Llama 3.3 70B** | `llama-3.3-70b-versatile` | Recomendado - Balance perfecto |
| **Llama 3.1 8B** | `llama-3.1-8b-instant` | Más rápido |
| **Mixtral 8x7B** | `mixtral-8x7b-32768` | Contexto largo |
| **Gemma 2 9B** | `gemma2-9b-it` | Ligero y eficiente |

## ⚙️ Parámetros

- **Temperatura**: 0-2 (0 = determinista, 2 = muy creativo)
- **Max Tokens**: 1024 por defecto
- **Modelo**: Selecciona según tu necesidad

## 📝 Ejemplos de Uso

### Análisis de datos
```excel
=GROQ("Resume estos datos en 3 puntos clave: " & A1:A10)
```

### Traducción
```excel
=GROQ("Traduce al inglés: " & B2)
```

### Generación de contenido
```excel
=GROQ("Escribe 5 ideas de marketing para un producto de " & C2)
```

### Análisis de sentimiento
```excel
=GROQ("¿Este comentario es positivo, negativo o neutral?: " & D2)
```

## 🔐 Seguridad

- Tu API Key se guarda de forma segura en las propiedades de usuario
- Solo tú puedes acceder a ella
- Nunca se comparte con otros usuarios del documento

## 🛠️ Comandos de Desarrollo

```bash
# Subir cambios a Google Sheets
clasp push

# Descargar cambios desde Google Sheets
clasp pull

# Abrir el proyecto en el navegador
clasp open
```

## 📚 Recursos

- [Documentación de Groq](https://console.groq.com/docs)
- [Modelos disponibles](https://console.groq.com/docs/models)
- [Apps Script Reference](https://developers.google.com/apps-script/reference)

## ⚠️ Límites de Groq

- Free tier: 30 requests/minute
- Consulta los límites actuales en tu [dashboard de Groq](https://console.groq.com)

## 🐛 Solución de Problemas

### Error: "Por favor configura tu API Key"
→ Ve a **Groq LLM → Configurar API Key** e ingresa tu clave

### Error: "Error al conectar con Groq"
→ Verifica que tu API Key sea válida y tengas conexión a internet

### La función GROQ no aparece
→ Recarga la página del Google Sheet

## 📄 Licencia

MIT License - Usa libremente en tus proyectos
