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
    .addItem('Configurar API Key', 'configurarAPIKey')
    .addItem('Ejecutar en celda seleccionada', 'ejecutarEnCelda')
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
 * Ejecuta el modelo LLM en la celda seleccionada
 */
function ejecutarEnCelda() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const cell = sheet.getActiveCell();
  const prompt = cell.getValue();
  
  if (!prompt) {
    SpreadsheetApp.getUi().alert('⚠️ La celda seleccionada está vacía');
    return;
  }
  
  const respuesta = llamarGroqAPI(prompt.toString());
  
  // Coloca la respuesta en la celda adyacente
  cell.offset(0, 1).setValue(respuesta);
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
