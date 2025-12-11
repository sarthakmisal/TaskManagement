import './App.css'
import { BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import ForgotPass from './components/ForgotPass';
import Dashboard from './pages/Dashboard';
function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login'
          element={!isAuthenticated ? <Login></Login> : <Navigate to='/dashboard'> </Navigate>}>
        </Route>
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path='/forgot-password' element={<ForgotPass></ForgotPass>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
