import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'

import ProjectPage from './pages/ProjectPage'

function App() {
  return (
      <BrowserRouter>
          {/* <Header /> */}
          <Routes>
              <Route path="/project" element={<ProjectPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
      </BrowserRouter>
  )
}

export default App
