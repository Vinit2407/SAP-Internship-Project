import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/Place Order/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Profile from './pages/Profile/Profile';
import SearchResults from './pages/SearchResults/SearchResults'
import { StoreContext } from './context/StoreContext'
import './index.css'


const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (appLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<SearchResults />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App