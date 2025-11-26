// Configuración de la API de Groq
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Crea el menú personalizado al abrir el documento
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 Groq LLM')
    .addItem('Abrir Panel', 'mostrarPanel')
    .addSeparator()
    .addItem('📝 Configurar Prompt', 'configurarPrompt')
    .addItem('▶️ Ejecutar Prompt en Selección', 'ejecutarEnCelda')
    .addSeparator()
    .addItem('🔑 Configurar API Key', 'configurarAPIKey')
    .addToUi();
}

/**
 * Muestra el panel lateral para interactuar con el LLM
 */
function mostrarPanel() {
  const html = HtmlService.createHtmlOutputFromFile('Panel')
    .setTitle('Groq LLM Assistant')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Configura la API Key de Groq
 */
function configurarAPIKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Configurar API Key de Groq',
    'Ingresa tu API Key de Groq:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    const apiKey = response.getResponseText();
    PropertiesService.getScriptProperties().setProperty('key-groq', apiKey);
    ui.alert('✅ API Key configurada correctamente');
  }
}

/**
 * Obtiene la API Key almacenada desde las propiedades del script
 */
function obtenerAPIKey() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('key-groq');
  if (!apiKey) {
    throw new Error('❌ No se encontró la API Key. Por favor configúrala en: Groq LLM → Configurar API Key');
  }
  return apiKey;
}

/**
 * Configura el prompt prediseñado
 */
function configurarPrompt() {
  const ui = SpreadsheetApp.getUi();
  const promptActual = PropertiesService.getScriptProperties().getProperty('prompt-prediseñado') || obtenerPromptPorDefecto();
  
  const htmlTemplate = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_top">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        textarea { width: 100%; height: 400px; font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        .buttons { margin-top: 15px; display: flex; gap: 10px; }
        button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #1a73e8; color: white; }
        .btn-secondary { background: #5f6368; color: white; }
        .btn-default { background: #e8eaed; color: #202124; }
        button:hover { opacity: 0.9; }
        .info { background: #e8f0fe; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="info">
        <strong>Instrucciones:</strong><br>
        • Usa <code>{valor}</code> donde quieras insertar el contenido de cada celda<br>
        • El prompt se aplicará a todas las celdas seleccionadas<br>
        • Puedes usar el prompt por defecto o personalizarlo
      </div>
      <textarea id="promptText">${promptActual.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
      <div class="buttons">
        <button class="btn-primary" onclick="guardar()">💾 Guardar</button>
        <button class="btn-default" onclick="restaurarDefecto()">🔄 Restaurar por defecto</button>
        <button class="btn-secondary" onclick="google.script.host.close()">Cancelar</button>
      </div>
      <script>
        function guardar() {
          const texto = document.getElementById('promptText').value;
          if (texto.trim() === '') {
            alert('⚠️ El prompt no puede estar vacío');
            return;
          }
          if (!texto.includes('{valor}')) {
            alert('⚠️ El prompt debe incluir {valor} para insertar el contenido de las celdas');
            return;
          }
          google.script.run.withSuccessHandler(function() {
            alert('✅ Prompt configurado correctamente');
            google.script.host.close();
          }).guardarPrompt(texto);
        }
        
        function restaurarDefecto() {
          if (confirm('¿Restaurar el prompt por defecto?')) {
            google.script.run.withSuccessHandler(function(defecto) {
              document.getElementById('promptText').value = defecto;
            }).obtenerPromptPorDefecto();
          }
        }
      </script>
    </body>
    </html>
  `).setWidth(700).setHeight(600);
  
  ui.showModalDialog(htmlTemplate, '📝 Configurar Prompt');
}

/**
 * Obtiene el prompt por defecto para el sector salud
 */
function obtenerPromptPorDefecto() {
  return `Analiza la siguiente noticia del sector salud en Colombia y construye un resumen ejecutivo enfocado en su impacto para la industria farmacéutica:

NOTICIA:
{valor}

ANÁLISIS REQUERIDO:

**1. FLUJO DE RECURSOS FINANCIEROS**
- ADRES y giro de recursos (UPC, giro directo)
- Presupuestos máximos y disponibilidad
- Decisiones regulatorias y fiscales
- Impacto en tesorería de laboratorios

**2. ACCESO A NUEVAS TERAPIAS**
- Aprobaciones INVIMA (registros sanitarios)
- Inclusiones/exclusiones PBS y UPC
- Evaluaciones IETS
- Compras centralizadas y negociaciones
- Prescripciones MIPRES

**3. REGULACIÓN DE PRECIOS**
- Decisiones CNPMDM
- Reportes SISMED obligatorios
- Circulares de control de precios
- Sanciones y procedimientos

**FORMATO DE SALIDA:**

📋 **RESUMEN EJECUTIVO**
[Resumen de 2-3 líneas del impacto principal]

🎯 **EJES DE IMPACTO:**

💰 **Flujo de Recursos:**
[Análisis específico]

💊 **Acceso a Terapias:**
[Análisis específico]

💲 **Regulación de Precios:**
[Análisis específico]

🚦 **SEMÁFORO DE IMPACTO:**
- 🔴 Crítico: [si aplica]
- 🟡 Moderado: [si aplica]
- 🟢 Positivo: [si aplica]

✅ **RECOMENDACIONES ACCIONABLES:**
1. [Acción específica inmediata]
2. [Acción específica a corto plazo]
3. [Acción específica a mediano plazo]

⚡ **PRIORIDAD:** [Alta/Media/Baja]

---
Sé específico, conciso y enfócate en insights accionables para equipos de market access, finanzas y regulatorio.`;
}

/**
 * Guarda el prompt personalizado
 */
function guardarPrompt(texto) {
  PropertiesService.getScriptProperties().setProperty('prompt-prediseñado', texto);
}

/**
 * Obtiene el prompt prediseñado
 */
function obtenerPrompt() {
  let prompt = PropertiesService.getScriptProperties().getProperty('prompt-prediseñado');
  if (!prompt) {
    // Si no hay prompt configurado, usar el por defecto
    prompt = obtenerPromptPorDefecto();
    PropertiesService.getScriptProperties().setProperty('prompt-prediseñado', prompt);
  }
  return prompt;
}

/**
 * Ejecuta el modelo LLM en las celdas seleccionadas usando el prompt prediseñado
 */
function ejecutarEnCelda() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  const numRows = range.getNumRows();
  const numCols = range.getNumColumns();
  
  // Si no hay selección o está vacía
  if (!range || numRows === 0) {
    SpreadsheetApp.getUi().alert('⚠️ Por favor selecciona una o más celdas con contenido');
    return;
  }
  
  // Obtener el prompt prediseñado
  let promptTemplate;
  try {
    promptTemplate = obtenerPrompt();
  } catch (error) {
    SpreadsheetApp.getUi().alert(error.message);
    return;
  }
  
  SpreadsheetApp.getUi().alert('🚀 Procesando ' + (numRows * numCols) + ' celda(s) con el prompt configurado...\n\nEsto puede tomar unos momentos.');
  
  const resultados = [];
  
  // Procesar cada celda
  for (let i = 0; i < numRows; i++) {
    const fila = [];
    for (let j = 0; j < numCols; j++) {
      const cellValue = values[i][j];
      
      if (cellValue && cellValue.toString().trim() !== '') {
        try {
          // Reemplazar {valor} con el contenido de la celda
          const promptFinal = promptTemplate.replace('{valor}', cellValue.toString());
          const respuesta = llamarGroqAPI(promptFinal);
          fila.push(respuesta);
        } catch (error) {
          fila.push('ERROR: ' + error.message);
        }
      } else {
        fila.push('');
      }
    }
    resultados.push(fila);
  }
  
  // Colocar resultados en las celdas adyacentes (a la derecha)
  const targetRange = range.offset(0, numCols, numRows, numCols);
  targetRange.setValues(resultados);
  
  SpreadsheetApp.getUi().alert('✅ Proceso completado: ' + (numRows * numCols) + ' celda(s) procesadas');
}

/**
 * Función principal para llamar a la API de Groq
 */
function llamarGroqAPI(prompt, modelo = 'llama-3.3-70b-versatile', temperatura = 0.7, maxTokens = 1024) {
  const apiKey = obtenerAPIKey();
  
  const payload = {
    model: modelo,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: temperatura,
    max_tokens: maxTokens
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(GROQ_API_URL, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.error) {
      throw new Error('Error de API: ' + json.error.message);
    }
    
    return json.choices[0].message.content;
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    throw new Error('Error al conectar con Groq: ' + error.toString());
  }
}

/**
 * Función personalizada para usar en fórmulas de Sheets
 * Uso: =GROQ("Tu pregunta aquí")
 */
function GROQ(prompt, modelo, temperatura) {
  if (!prompt) {
    return '❌ Proporciona un prompt';
  }
  
  try {
    modelo = modelo || 'llama-3.3-70b-versatile';
    temperatura = temperatura || 0.7;
    return llamarGroqAPI(prompt, modelo, temperatura);
  } catch (error) {
    return 'ERROR: ' + error.toString();
  }
}

/**
 * Obtiene la lista de modelos disponibles
 */
function obtenerModelos() {
  return [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recomendado)' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Rápido)' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
  ];
}
