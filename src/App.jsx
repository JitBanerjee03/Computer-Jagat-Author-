import { useState } from 'react'
import './App.css'
import Footer from './components/Footer'
import { ContextProvider } from './store/ContextProvider'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <ContextProvider>
        <Header/>
        <Outlet/>
        <Footer/>
      </ContextProvider>
    </>
  )
}

export default App;
