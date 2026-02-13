import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/director/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthProvider";
import DashboardDocent from "./pages/docent/DashboardDocent";
import Layout from "./components/Layout";
import GestionUsuarios from "./pages/director/GestionUsuarios";
import Reportes from "./pages/director/Reportes";
import LoginRedirect from "./components/LoginRedirect";
import MisCursos from "./pages/docent/MisCursos";
import PlanTrabajo from "./pages/docent/PlanTrabajo";
import Juegos from "./pages/docent/juegos";
import GestionCursos from "./pages/director/GestionCursos";
import FormularPreguntas from "./pages/docent/FormularPreguntas";
import SubirMaterial from "./pages/docent/SubirMaterial";
import CalificarAlumnos from "./pages/docent/CalificarAlumnos";
import DashboardStudent from "./pages/student/DashboardStudent";
import MaterialesAlumno from "./pages/student/MaterialesAlumno";
import PlanTrabajoVer from "./pages/director/PlanTrabajo";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <PrivateRoute allowedRoles={['director']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/gestionUsuarios"
              element={<GestionUsuarios />}
            />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/planTrabajoVer" element={<PlanTrabajoVer />} />
            <Route path="/cursos" element={<GestionCursos />} />
          </Route>

          <Route
            element={
              <PrivateRoute allowedRoles={['docente']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboardDocente" element={<DashboardDocent />} />
            <Route path="/mis-cursos" element={<MisCursos />} />
            <Route path="/subir-material" element={<SubirMaterial />} />
            <Route path="/formular-preguntas" element={<FormularPreguntas />} />
            <Route path="/plan-trabajo" element={<PlanTrabajo />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/calificar-alumnos" element={<CalificarAlumnos />} />



          </Route>

          <Route
            element={
              <PrivateRoute allowedRoles={['alumno']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboardStudent" element={<DashboardStudent />} />
            <Route path="/alumno/curso/:cursoId" element={<MaterialesAlumno />} />
          </Route>

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<Home />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
