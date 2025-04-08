import React from 'react'
import RenderCard from './components/renderCard'
import Dashboard from './components/dash'
import Footer from './components/footer'
const App = () => {
  return (
    <div>
     <Dashboard/>
      {/* <p>{data.users}</p> */}
      <RenderCard/>
      <Footer/>
    </div>
  )
}

export default App
