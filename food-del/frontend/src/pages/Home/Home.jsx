// In Home.jsx
import React, { useState, useEffect, useContext } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import { StoreContext } from '../../context/StoreContext'

const Home = () => {
  const [category, setCategory] = useState("All");
  const { food_list, loading } = useContext(StoreContext);

  if (loading || !food_list) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className='home'>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/>
    </div>
  )
}

export default Home
