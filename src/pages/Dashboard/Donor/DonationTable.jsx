import React from 'react';

export const DonationTable = ({ donation }) => {
  return (
    <tr>
      <td>{donation.recipientName}</td>
      <td>{donation.recipientDistrict}</td>
      <td>{donation.recipientUpazila}</td>
      <td>{donation.hospitalName}</td>
      <td>{donation.donationDate}</td>
      <td>{donation.donationTime}</td>
      <td>{donation.status}</td>
    </tr>
  );
};
