import { ProjectPage } from 'pages/ProjectPage';
import { AuthPage } from 'pages/AuthPage';
import { RegisterPage } from 'pages/RegisterPage';

import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
