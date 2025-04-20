import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from './context/AuthContext'
import './App.css' 
import Edit from './pages/Edit/Edit';

const App = () => {
  const url = "http://localhost:4000"
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app-container">
      <ToastContainer />
      {isAuthenticated && <Navbar />}
      <div className="main-content">
        {isAuthenticated && <Sidebar />}
        <div className="page-content">
          <Routes>
            <Route path="/login" element={<Login url={url} />} />
            <Route
              path="/add"
              element={
                isAuthenticated ? <Add url={url} /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/list"
              element={
                isAuthenticated ? <List url={url} /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/edit/:id"
              element={
                isAuthenticated ? <Edit url={url} /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/orders"
              element={
                isAuthenticated ? <Orders url={url} /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/add" : "/login"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App