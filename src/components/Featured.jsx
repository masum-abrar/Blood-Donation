import React from 'react'

import pic3 from '../assets/pic3.jpg'
import pic4 from '../assets/pic4.jpg'
import pic5 from '../assets/pic5.jpg'

export const Featured = () => {
  return (
 <div>  <h1 className='font-bold text-center text-2xl mt-10'>
         Blood Donation Process</h1>
    <div className='lg:flex flex-row'>
       
        <div className="card w-96 bg-base-100 shadow-xl max-w-screen-xl mx-auto mb-16 ">
           
  <figure className="px-10 pt-10">
    <img src={pic5} alt="Shoes" className="rounded-xl" />
  </figure>
  <div className="card-body">
    <h2 className="card-title font-bold">REGISTER</h2>
    <p>You need fulfill a simple register form. Which required all contact and need information for donating Blood</p>
   
  </div>
</div>
<div className="card w-96 bg-base-100 shadow-xl max-w-screen-xl mx-auto mb-16">
           
           <figure className="px-10 pt-10">
             <img src={pic4} alt="Shoes" className="rounded-xl" />
           </figure>
           <div className="card-body ">
             <h2 className="card-title font-bold">SCREENING</h2>
             <p>A drop of blood from your finger will take for simple test to ensure that your blood iron levels are proper enough for donation process.</p>
            
           </div>
         </div>
         <div className="card w-96 bg-base-100 shadow-xl max-w-screen-xl mx-auto mb-16">
           
           <figure className="px-10 pt-10">
             <img src={pic3} alt="Shoes" className="rounded-xl" />
           </figure>
           <div className="card-body ">
             <h2 className="card-title font-bold">DONATION</h2>
             <p>After ensuring and passed screening test successfully you will be directed to a donor bed for donation. It will take only 6-10 minutes.</p>
             
           </div>
         </div>
    </div>
    </div>
  )
}
