import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [italiano, setItaliano] = useState("");
  const [espanol, setEspanol] = useState("");
  const [nota, setNota] = useState("");
  const [palabras, setPalabras] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar palabras guardadas
  useEffect(() => {
    const datos = localStorage.getItem("vocabolario");

    if (datos) {
      setPalabras(JSON.parse(datos));
    }
  }, []);

  // Guardar automáticamente
  useEffect(() => {
    localStorage.setItem(
      "vocabolario",
      JSON.stringify(palabras)
    );
  }, [palabras]);

  // Traducir con DeepL
  async function traducir() {

    if (!italiano.trim()) {
      alert("Escribe una palabra.");
      return;
    }

    try {

const respuesta = await fetch(
  "https://vocabolario-italiano.onrender.com/traducir",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texto: italiano,
          }),
        }
      );

      const datos = await respuesta.json();

      if (datos.traduccion) {
        setEspanol(datos.traduccion);
      } else {
        alert("No se pudo traducir.");
      }

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor.");
    }
  }

  // Guardar palabra
  function guardarPalabra() {

    if (
      italiano.trim() === "" ||
      espanol.trim() === ""
    ) {
      alert("Completa Italiano y Español.");
      return;
    }

    // Evitar duplicados
    const existe = palabras.some(
      (p) =>
        p.italiano.toLowerCase() ===
        italiano.trim().toLowerCase()
    );

    if (existe) {
      alert("⚠️ Esa palabra ya existe.");
      return;
    }

    const nueva = {
      id: Date.now(),
      italiano: italiano.trim(),
      espanol: espanol.trim(),
      nota: nota.trim(),
    };

    setPalabras((anteriores) => {

      const lista = [...anteriores, nueva];

      lista.sort((a, b) =>
        a.italiano.localeCompare(
          b.italiano,
          "it",
          {
            sensitivity: "base",
          }
        )
      );

      return lista;

    });

    setItaliano("");
    setEspanol("");
    setNota("");

  }

  // Eliminar palabra
  function eliminar(id) {

    setPalabras((anteriores) =>
      anteriores.filter(
        (p) => p.id !== id
      )
    );

  }

  // Buscar palabras
  const palabrasFiltradas =
    palabras.filter((p) =>
      p.italiano
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||

      p.espanol
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||

      p.nota
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );

      return (
    <div className="app">

      <h1>🇮🇹 Vocabolario Italiano</h1>
      <p className="subtitulo">
        Il tuo dizionario personale
      </p>

      <div className="formulario">

        <input
          type="text"
          placeholder="Palabra en italiano"
          value={italiano}
          onChange={(e) =>
            setItaliano(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Traducción al español"
          value={espanol}
          onChange={(e) =>
            setEspanol(e.target.value)
          }
        />

        <textarea
          placeholder="📝 Nota (opcional)"
          value={nota}
          onChange={(e) =>
            setNota(e.target.value)
          }
          rows={3}
        />

        <div className="buttons">

          <button
            onClick={traducir}
          >
            🌐 Traducir
          </button>

          <button
            onClick={guardarPalabra}
          >
            💾 Guardar
          </button>

        </div>

      </div>

      <input
        className="buscar"
        type="text"
        placeholder="🔍 Buscar..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
      />

      <h2>
        📖 Mi diccionario
      </h2>

      <div className="lista">

        {palabrasFiltradas.length === 0 ? (

          <p>
            No hay palabras.
          </p>

        ) : (

          palabrasFiltradas.map((p) => (

            <div
              className="palabra"
              key={p.id}
            >

              <div>

                <strong>
                  🇮🇹 {p.italiano}
                </strong>

                <br />

                <span>
                  🇪🇸 {p.espanol}
                </span>

                {p.nota && (
                  <>
                    <br />

                    <small>
                      📝 {p.nota}
                    </small>
                  </>
                )}

              </div>

              <button
                className="eliminar"
                onClick={() =>
                  eliminar(p.id)
                }
              >
                🗑
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default App;