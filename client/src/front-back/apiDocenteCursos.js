const API_URL = "http://localhost:5000/api";

export const getListCursosDocente = async (id) => {
  const response = await fetch(`${API_URL}/listCursosDocente/${id}`);

  if (!response.ok) {
    const text = await response.text();
    console.error("Error:", text);
    throw new Error("Error al obtener cursos");
  }

  return response.json();
};

export const insertAlumnoCurso = async (formData) => {
  const response = await fetch(`${API_URL}/insertAlumnoCursos`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const listAlumnosCursos = async (id) => {
  const response = await fetch(`${API_URL}/listAlumnosCursos/${id}`);
  return response.json();
};

export const marcarAsistencia = async (data) => {
  const response = await fetch(`${API_URL}/marcarAsistencia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};



export const materialCurso = async (formData) => {
  const response = await fetch(`${API_URL}/materialCurso`,{
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const listadoMaterialCurso = async () => {
  const response = await fetch(`${API_URL}/listadoMaterialCurso`,{
    method: "GET",
  });
  return response.json();
};

export const materialPorCurso = async (id) => {
  const response = await fetch(`${API_URL}/materialPorCurso/${id}`,{
    method: "GET",
  });
  return response.json();
};