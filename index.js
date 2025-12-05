import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, query, orderBy, limit, setLogLevel } from 'firebase/firestore';
import { Archive, Search, Users, TreeDeciduous, Loader2 } from 'lucide-react';

// === Configuración de Globales y Firebase ===

// Las siguientes variables son proporcionadas por el entorno de Canvas.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'sefarad-mx-default-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Establecer el nivel de registro de Firestore para depuración (Recomendado)
setLogLevel('debug');

// Componente Principal de la Aplicación
const App = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appData, setAppData] = useState(null);
  const [currentView, setCurrentView] = useState('tree'); // 'tree', 'search', 'sources'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Inicialización de Firebase y Autenticación
  useEffect(() => {
    try {
      if (Object.keys(firebaseConfig).length === 0) {
        throw new Error("La configuración de Firebase no está disponible.");
      }

      // Inicializar Firebase App
      const app = initializeApp(firebaseConfig);
      const initializedAuth = getAuth(app);
      const initializedDb = getFirestore(app);

      setAuth(initializedAuth);
      setDb(initializedDb);

      // Listener para el estado de autenticación
      const unsubscribe = onAuthStateChanged(initializedAuth, async (user) => {
        if (user) {
          // Usuario autenticado (con token o anónimo)
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          // Intento de inicio de sesión inicial
          try {
            if (initialAuthToken) {
              // Intentar iniciar sesión con el token personalizado
              await signInWithCustomToken(initializedAuth, initialAuthToken);
            } else {
              // Si no hay token, iniciar sesión anónimamente
              await signInAnonymously(initializedAuth);
            }
          } catch (authError) {
            console.error("Error al iniciar sesión en Firebase:", authError);
            // Fallback: Si la autenticación falla, usar un ID temporal (no persistente en Firestore)
            const fallbackId = 'guest-' + crypto.randomUUID();
            setUserId(fallbackId);
            setIsAuthReady(true);
            setError("Advertencia: No se pudo establecer la sesión completa. Operando como usuario invitado.");
          }
        }
        setLoading(false);
      });

      // Limpiar el listener al desmontar el componente
      return () => unsubscribe();

    } catch (e) {
      console.error("Error fatal en la inicialización:", e);
      setError(e.message);
      setLoading(false);
    }
  }, []);

  // 2. Carga de Datos (Usando onSnapshot)
  useEffect(() => {
    // Solo intentar cargar datos si Firebase está listo y tenemos un userId
    if (!isAuthReady || !db || !userId) return;

    // Ruta de la colección pública (datos compartidos del árbol familiar)
    const publicCollectionPath = `artifacts/${appId}/public/data/family_tree_entries`;
    const treeRef = collection(db, publicCollectionPath);
    
    // Consulta simple: Traer solo una pequeña muestra para demostrar la conexión
    const q = query(treeRef, limit(5));

    console.log(`Intentando conectar a Firestore: ${publicCollectionPath}`);

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppData(entries);
      console.log("Datos del árbol familiar cargados:", entries);
    }, (snapshotError) => {
      console.error("Error al obtener snapshot de Firestore:", snapshotError);
      // Solo mostrar error si no es un error de permisos (que puede ocurrir si las reglas no están 100% correctas inicialmente)
      if (snapshotError.code !== 'permission-denied') {
         setError(`Error de datos: ${snapshotError.message}`);
      } else {
         console.warn("Error de permisos, puede que la colección no exista aún o que las reglas de seguridad necesiten ajuste.");
      }
    });

    // Limpiar el listener cuando el componente o las dependencias cambien
    return () => unsubscribeSnapshot();
  }, [isAuthReady, db, userId]); // Dependencias clave

  // 3. Renderizado de Contenido Principal
  const renderContent = () => {
    if (!isAuthReady || loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="mt-4 text-gray-700">Cargando plataforma Sefarad-MX...</p>
        </div>
      );
    }
    
    if (error) {
        return (
            <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg shadow-md">
                <h3 className="font-bold">Error de Conexión</h3>
                <p>{error}</p>
                <p className="text-sm mt-2">ID de Usuario actual: <span className="font-mono break-all">{userId}</span></p>
            </div>
        );
    }

    // Contenido basado en la vista actual
    switch (currentView) {
      case 'tree':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Árbol Familiar Unificado</h2>
            <p className="text-gray-600 mb-4">Visualización colaborativa de las familias sefardíes en México.</p>
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 min-h-64">
                {appData && appData.length > 0 ? (
                  <>
                    <p className="font-medium text-indigo-600 mb-2">Primeros registros de prueba cargados desde Firestore:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {appData.map((data) => (
                        <li key={data.id}>
                          Persona ID: {data.id} - Nombre de Prueba: {data.name || 'Sin nombre'}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-500">¡La conexión con la base de datos es exitosa!</p>
                  </>
                ) : (
                  <p className="text-gray-500">No hay datos en el árbol aún. ¡Empieza a añadir personas!</p>
                )}
            </div>
          </div>
        );
      case 'search':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Búsqueda Avanzada y Fonética</h2>
            <p className="text-gray-600">Encuentra ancestros sefardíes usando variaciones ortográficas y apellidos clave.</p>
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-64 mt-4 text-gray-500">
                <Search className="w-6 h-6 inline mr-2 text-yellow-600" />
                Motor de búsqueda (Elasticsearch) en desarrollo...
            </div>
          </div>
        );
      case 'sources':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fuentes y Archivos</h2>
            <p className="text-gray-600">Indexación colaborativa de registros históricos (Inquisición, Kétubot, etc.).</p>
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-64 mt-4 text-gray-500">
                <Archive className="w-6 h-6 inline mr-2 text-green-600" />
                Herramienta de indexación de documentos en desarrollo...
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 4. Componente de Navegación (Botones)
  const NavButton = ({ view, icon: Icon, label }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
            : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium text-sm hidden sm:inline">{label}</span>
      </button>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8">
      {/* Encabezado Principal y Usuario */}
      <header className="mb-8 p-4 bg-white rounded-xl shadow-lg border-b-4 border-indigo-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-extrabold text-indigo-800 flex items-center mb-2 sm:mb-0">
            <TreeDeciduous className="w-8 h-8 mr-2 text-indigo-600" />
            Sefarad-MX
          </h1>
          <div className="text-sm text-right">
            <p className="font-semibold text-gray-700">Usuario Conectado:</p>
            {userId ? (
              <p className="font-mono text-xs text-indigo-500 break-all p-1 bg-indigo-50 rounded">
                {userId}
              </p>
            ) : (
              <p className="text-red-500">Desconectado</p>
            )}
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-500 italic">Plataforma de Genealogía Sefardí-Mexicana.</p>
      </header>

      {/* Navegación */}
      <nav className="mb-8 flex justify-center sticky top-4 z-10">
        <div className="flex space-x-2 p-2 bg-gray-200 rounded-full shadow-xl">
          <NavButton view="tree" icon={Users} label="Árbol Familiar" />
          <NavButton view="search" icon={Search} label="Búsqueda Avanzada" />
          <NavButton view="sources" icon={Archive} label="Fuentes Históricas" />
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto">
        {renderContent()}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="mt-12 text-center text-xs text-gray-500">
        <p>Desarrollado como un proyecto de código abierto Sefarad-MX. Los datos mostrados son de prueba y residen en la colección pública de Firestore.</p>
      </footer>
    </div>
  );
};

export default App;

