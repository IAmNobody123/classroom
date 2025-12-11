const API_URL = "http://localhost:5000/api";

export const registerUser = async (formData) => {
  const response = await fetch(`${API_URL}/registerUsers`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const getListUsers = async () => {
  const response = await fetch(`${API_URL}/listUsers`);
  return response.json();
}

export const getListDocentes = async () => {
  const response = await fetch(`${API_URL}/listDocentes`);
  return response.json();
}

export const getListCursos = async () => {
  const response = await fetch(`${API_URL}/listCursos`);
  return response.json();
}

export const insertCurso = async (data) => {
  const response = await fetch(`${API_URL}/insertCurso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
   if (!response.ok) {
    const text = await response.text();
    console.error("Error de servidor:", text);
    return { success: false, error: "Error en el servidor" };
  }

  const result = await response.json();
  return { success: true, ...result };
}