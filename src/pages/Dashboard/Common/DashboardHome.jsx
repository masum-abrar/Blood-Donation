import React from 'react'
import { AdminHome } from '../Admin/AdminHome'
import { DonorHome } from '../Donor/DonorHome';
import { VolunteerHome } from '../Volunteer/VolunteerHome';
import { UseAdmin } from '../../../hooks/UseAdmin';
import { useDonor } from '../../../hooks/UseDonor';
import { UseVolunteer } from '../../../hooks/UseVolunteer';

export const DashboardHome = () => {
  const [isAdmin] = UseAdmin();
  const [isDonor] = useDonor();
  const [isVolunteer]= UseVolunteer();

  let links;
if (isAdmin) {
    links = <AdminHome></AdminHome>;
} else if (isDonor) {
    links = <DonorHome></DonorHome> ;
} 
else if (isVolunteer) {
    links =  <VolunteerHome></VolunteerHome> ;
}   

  return (
    <div>
      {links}
    </div>
  )
}
