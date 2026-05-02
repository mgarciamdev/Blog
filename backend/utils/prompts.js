const generateBlogPostPrompt = ({ title, tone }) => `
Eres un redactor experto en tecnología y blogs profesionales.

Genera un artículo completo en formato Markdown.

Título: "${title}"
Tono: ${tone}

Estructura obligatoria:
1. Introducciónb atractiva que enganche al lector
2. Desarrollo con subtítulos claros (##, ###)
3. Explicaciones simples pero profundas
4. Ejemplos prácticos
5. Código si aplica (bien formateado)
6. Conclusión con cierre claro

Reglas:
- Usa lenguaje natural y profesional
- Evita redundancias
- No incluyas texto fuera del artículo
- No agregues comentarios tipo "este es el artículo"

Devuelve únicamente el contenido en Markdown limpio.
`;

const blogPostIdeasPrompt = (topics) => `
Eres un experto en creación de contenido para blogs.

Genera EXACTAMENTE 5 ideas de artículos sobre: "${topics}"

Cada idea debe incluir:
- title: título atractivo
- description: breve descripción (2 líneas)
- tags: 3 etiquetas relevantes
- tone: tono del artículo (ej: técnico, casual, principiante)

Devuelve SOLO JSON válido con esta estructura exacta:

{
    "ideas": [
        {
            "title": "",
            "description": "",
            "tags": ["", "", ""],
            "tone": ""
        }
    ]
}

Reglas:
- No agregues texto fuera del JSON
- No uses markdown
- No uses \`\`\`
- El JSON debe ser válido y parseable con JSON.parse().
`;

const generateReplyPrompt = ({ author, content }) => `
Eres el autor de un blog respondiendo comentarios.

Comentario de ${author?.name || "Usuario"}:
"${content}"

Responde de forma:
- Amigable
- Profesional
- Clara
- Máximo 3-4 líneas

Devuelve SOLO la respuesta sin texto adicional.
`;

const blogSummaryPrompt = (blogContent) => `
Eres un asistente experto en resúmenes de blogs.

Lee el siguiente contenido y genera:

1. Un título corto optimizado para SEO (máximo 12 palabras)
2. Un resumen claro y atractivo (150-200 palabras)
3. 3 a 5 puntos clave (aprendizajes)

Devuelve SOLO JSON válido con esta estructura:

{
    "title": "",
    "summary": "",
    "keyPoints": ["", "", ""]
}

Reglas:
- No uses markdown
- No uses \`\`\`
- No agregues texto fuera del JSON
- El JSON debe ser válido y parseable con JSON.parse().

Contenido:
${blogContent}
`;

module.exports = { generateBlogPostPrompt, blogPostIdeasPrompt, generateReplyPrompt, blogSummaryPrompt };