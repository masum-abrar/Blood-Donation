import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Home } from '../pages/Home'
import { Footer } from '../components/Footer'

export const Layout = () => {
  return (
    <div>
        <Navbar></Navbar>
       <Outlet>
        <Home></Home>
       </Outlet>
       <Footer></Footer>
       
    </div>
  )
}
