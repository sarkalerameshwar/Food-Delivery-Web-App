import React, { useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu.jsx'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay.jsx'
import AppDownload from '../../components/AppDownload/AppDownload.jsx'

const Home = () => {

  const [category, setCategory] = useState("All")

  return (
    <div>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category}/>
        <AppDownload/>
    </div>
  )
}

export default Home
