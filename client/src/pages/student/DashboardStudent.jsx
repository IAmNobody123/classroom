import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import "../../styles/docente/formularPreguntas.css"; // Reuse existing styles
import "../../styles/docente/formularPreguntas.css";

export default function DashboardStudent() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            // Fetch Cursos
            const fetchCursos = async () => {
                try {
                    // Assuming apiDocenteCursos exported listCursosAlumno or we add it
                    // Let's assume we used the same route structure
                    const response = await fetch(`http://localhost:5000/api/listCursosAlumno/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCursos(data);
                    } else {
                        console.error("Error fetching student courses");
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            fetchCursos();
        }
    }, [user]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Bienvenido, {user?.username} (Alumno)</h1>
            <h2>Mis Cursos</h2>
            <div className="cursos-grid" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
                {cursos.length > 0 ? (
                    cursos.map((c) => (
                        <div
                            key={c.id}
                            className="curso-card"
                            style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", width: "250px", cursor: "pointer", background: "white" }}
                            onClick={() => navigate(`/alumno/curso/${c.id}`)}
                        >
                            <h3>{c.nombre}</h3>
                            <p>{c.grado}</p>
                            <p>Docente: {c.docente}</p>
                        </div>
                    ))
                ) : (
                    <p>No estás inscrito en ningún curso o tus datos de alumno no están vinculados.</p>
                )}
            </div>
        </div>
    );
}
