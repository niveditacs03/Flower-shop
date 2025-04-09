import React from 'react'
import RenderCard from './components/renderCard'
import Dashboard from './components/dash'
import Footer from './components/footer'
import './global.css' 


const App = () => {
  return (
    <div>
     
      <Dashboard/>
      <RenderCard/>
      <Footer/>
    </div>
  )
}

export default App
