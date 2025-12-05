
📜 README.md para Sefarad-MX
🔎 Sefarad-MX: Genealogía Sefardí en México
Bienvenido al repositorio de Sefarad-MX, una plataforma digital dedicada a la preservación, el estudio y la conexión de los linajes de ascendencia Sefardí que se asentaron en México y el Virreinato de la Nueva España.
Nuestro objetivo es crear un Árbol Familiar Unificado y una biblioteca de fuentes especializadas para la comunidad, siguiendo un modelo colaborativo similar a FamilySearch, pero con un enfoque hiper-especializado en esta diáspora histórica.
✨ Visión y Propósito
El proyecto busca abordar el desafío de la investigación sefardí-mexicana, caracterizada por la variación de nombres, la dispersión de registros y la necesidad de cruzar fuentes eclesiásticas, civiles y, crucialmente, los Archivos de la Inquisición Mexicana.
 * Conectar el Árbol Global: Integrar y desduplicar a todas las personas en un único árbol genealógico colaborativo.
 * Fuentes Especializadas: Indexar documentos relevantes: actas parroquiales coloniales, listados de la Inquisición, registros comunitarios y libros de linajes.
 * Herramientas de Descubrimiento: Desarrollar algoritmos de búsqueda inteligentes para superar las barreras ortográficas y fonéticas (ej. Lopes vs. López).
🚀 Pila Tecnológica (Tech Stack)
Estamos construyendo una aplicación moderna, escalable y robusta, optimizada para el manejo de grandes volúmenes de datos relacionales y de grafos.
| Componente | Tecnología Principal | Propósito |
|---|---|---|
| Frontend (Interfaz de Usuario) | React con TypeScript | Experiencia de usuario dinámica y moderna para el árbol y la búsqueda. |
| Backend (API) | Django (Python) | Lógica de negocio, autenticación, y procesamiento de datos genealógicos. |
| Base de Datos Principal | PostgreSQL | Almacenamiento relacional robusto para personas, eventos y fuentes. |
| Base de Datos de Grafos | Neo4j (Evaluando) | Modelado eficiente de las complejas relaciones del árbol familiar unificado. |
| Búsqueda Avanzada | Elasticsearch o Solr | Motor de búsqueda de texto completo y facetada para registros históricos. |
🛠️ Estructura del Repositorio
| Carpeta | Contenido |
|---|---|
| frontend/ | Código fuente del cliente (React/TypeScript). |
| backend/ | Código del servidor Django, modelos y APIs. |
| data-ingestion/ | Scripts y utilidades para la carga inicial y el procesamiento de fuentes de datos masivas. |
| docs/ | Documentación técnica, diagramas de la arquitectura y el modelo de datos. |
| config/ | Archivos de configuración de entorno, despliegue (Docker/Kubernetes). |
🤝 ¿Cómo Contribuir?
¡Este es un proyecto de código abierto y completamente colaborativo! Necesitamos ayuda en varios frentes:
🧑‍💻 Desarrolladores (Frontend/Backend)
 * Clona el repositorio: git clone https://github.com/tu_usuario/sefarad-mx-platform.git
 * Revisa la sección de Issues para ver las tareas abiertas y las características planificadas.
 * Sigue nuestra Guía de Contribución en el archivo CONTRIBUTING.md.
📖 Historiadores y Genealogistas
 * Ayuda a identificar y catalogar fuentes primarias relevantes (archivos históricos en México, España, y otras regiones de la diáspora).
 * Verificación de Datos: Revisión y validación de las conexiones y fuentes del árbol familiar.
 * Indexación: Ayuda con la transcripción y el etiquetado de registros escaneados.
✏️ Diseñadores UX/UI
 * Mejora la visualización del árbol genealógico y las herramientas de búsqueda.
 * Diseño de la interfaz para la indexación y la gestión de fuentes.
🚦 Primeros Pasos para Ejecutar Localmente
Necesitas tener Python, Node.js y Docker instalados.
 * Backend Setup:
   cd backend/
pip install -r requirements.txt
python manage.py migrate

 * Frontend Setup:
   cd frontend/
npm install
npm start

 * Base de Datos (Recomendado):
   Utiliza el archivo docker-compose.yml para levantar PostgreSQL y Elasticsearch:
   docker-compose up -d

📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para obtener más detalles.
📧 Contacto
Para preguntas, sugerencias o propuestas de colaboración, abre un Issue o contacta al mantenedor principal: [Franck de Gauna] movimientocardenista@gmail.com.
