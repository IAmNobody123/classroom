import React from "react";
import useAuth from "../../context/useAuth";

export default function PerfilDirector() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #f1f5f9"
      }}>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <img
            src={user?.imagen || "/logo.svg"}
            alt="Perfil Director"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid #eff6ff",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.15)"
            }}
          />
        </div>

        <p style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "1.5rem", fontWeight: "700" }}>
          {user?.nombreDirector} {user?.apellidoDirector}
        </p>

        <span style={{
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          color: "white",
          padding: "6px 20px",
          borderRadius: "20px",
          fontWeight: "600",
          textTransform: "uppercase",
          fontSize: "0.85rem",
          letterSpacing: "0.5px",
          marginBottom: "30px",
          boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)"
        }}>
          {user?.rol || "Director"}
        </span>

        <div style={{
          width: "100%",
          borderTop: "2px solid #f1f5f9",
          paddingTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px"
        }}>
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "15px" }}>
            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.95rem", fontWeight: "500" }}>Correo Electrónico</p>
            <p style={{ color: "#0f172a", margin: "0", fontWeight: "700", fontSize: "1.1rem" }}>{user?.username || "No registrado"}</p>
          </div>
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "15px" }}>
            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.95rem", fontWeight: "500" }}>DNI</p>
            <p style={{ color: "#0f172a", margin: "0", fontWeight: "700", fontSize: "1.1rem" }}>{user?.dniDirector || "No registrado"}</p>
          </div>
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "15px" }}>
            <p style={{ color: "#64748b", margin: "0 0 8px 0", fontSize: "0.95rem", fontWeight: "500" }}>Estado</p>
            <p style={{ color: "#10b981", margin: "0", fontWeight: "700", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
              Activo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
