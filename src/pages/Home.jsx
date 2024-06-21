import React from 'react'
import { Carasoul } from '../components/Carasoul'
import { Featured } from '../components/Featured'
import { ContactUs } from '../components/ContactUs'

export const Home = () => {
  return (
    <div>
      <Carasoul></Carasoul>
      <Featured></Featured>
      <ContactUs></ContactUs>
    </div>
  )
}
