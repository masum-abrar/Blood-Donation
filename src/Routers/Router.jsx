
import {
    createBrowserRouter
  } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Dashboard } from "../dashboard/Dashboard";
import { AllUsers } from "../pages/Dashboard/Admin/AllUsers";
import { AllDonationRequest } from "../pages/Dashboard/Admin/AllDonationRequest";
import { MyDonationRequest } from "../pages/Dashboard/Donor/MyDonationRequest";
import { CreateDonationRequest } from "../pages/Dashboard/Donor/CreateDonationRequest";
import { DashboardHome } from "../pages/Dashboard/Common/DashboardHome";
import { Profile } from "../pages/Dashboard/Common/Profile";
import { BloodDonationRequest } from "../pages/BloodDonationRequest";
import { DonationReqDetails } from "../pages/DonationReqDetails";
import { EditDonation } from "../pages/EditDonation";
import { ContentManagement } from "../pages/Dashboard/Admin/ContentManagement";
import { AddBlog } from "../pages/Dashboard/Admin/AddBlog";
import { Funding } from "../pages/Funding";
import { GiveFund } from "../pages/GiveFund";
import { AllBlogs } from "../pages/AllBlogs";
import { Search } from "../pages/Search";


const Router = createBrowserRouter([
    {
      path: "/",
      element:  <Layout></Layout> ,
      children :[
        {
          path : "/",
          element : <Home></Home> ,
        },
        {
            path : "/login",
            element : <Login></Login> ,
          },
          {
            path : "/signup",
            element : <Signup></Signup> ,
          },
          // {
          //   path : "/donationrequest",
          //   element : <BloodDonationRequest></BloodDonationRequest> ,
          // },
          // {
          //   path: "/details/:id",
          //   element: <DonationReqDetails></DonationReqDetails> ,
           
          
          // },
          {
             path:"/donationrequests",
             element:<BloodDonationRequest></BloodDonationRequest>


          },
          
         
          {
             path:"/details/:id",
             element : <DonationReqDetails></DonationReqDetails>
          },
          {
            path: "/edit/:id",
            element: <EditDonation></EditDonation>
  
          },
          {
            path: "fund",
            element: <GiveFund></GiveFund>
  
          },
          {
            path: "funding",
            element: <Funding></Funding>
  
          },
          {
            path: "blog",
            element: <AllBlogs></AllBlogs>
  
          },
          {
            path: "search",
            element: <Search></Search>
  
          }

           
  
      ]
    },
    {
      path: '/dashboard',
      element: <Dashboard></Dashboard> ,
      children: [
        {
          path: '/dashboard',
          element: <DashboardHome></DashboardHome> ,
        },
        {
          path : "profile",
          element : <Profile></Profile> ,
        },
  
        //Admin Panel
        {
          path : "/dashboard/all-users",
          element : <AllUsers></AllUsers> ,
        },
        {
          path : "/dashboard/all-blood-donation-request",
          element : <AllDonationRequest></AllDonationRequest> ,
        },

        //Donor Panel
        {
          path : "/dashboard/my-donation-requests",
          element : <MyDonationRequest></MyDonationRequest> ,
        },
        {
          path : "/dashboard/create-donation-request",
          element : <CreateDonationRequest></CreateDonationRequest> ,
        },
        
        {
          path : "/dashboard/content-management",
          element : <ContentManagement></ContentManagement> ,
        },
        
        {
          path : "/dashboard/content-management/add-blog",
          element : <AddBlog></AddBlog> ,
        },
      ]
    }
   
   
  ]);

  export default Router