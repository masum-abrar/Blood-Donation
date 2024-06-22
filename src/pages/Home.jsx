import React from 'react'
import { Carasoul } from '../components/Carasoul'
import { Featured } from '../components/Featured'
import { ContactUs } from '../components/ContactUs'
import { Helmet } from 'react-helmet-async'

export const Home = () => {
  return (
    <div>
    <Helmet>
    <title>Blood | Home</title>
</Helmet>
      <Carasoul></Carasoul>
      <Featured></Featured>
      <ContactUs></ContactUs>
    </div>
  )
}
