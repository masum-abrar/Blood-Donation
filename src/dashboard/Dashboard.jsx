import { FaHome, FaList, FaSearch, FaEnvelope, FaHeart, FaUsers, FaUtensils } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { UseAdmin } from '../hooks/UseAdmin';

import { UseVolunteer } from '../hooks/UseVolunteer';
import { useDonor } from '../hooks/UseDonor';
import { AuthContext } from '../providers/AuthProviders';
import { useContext } from 'react';

export const Dashboard = () => {
    const [isAdmin] = UseAdmin();
    const [isDonor] = useDonor();
    const [isVolunteer] = UseVolunteer();
    const { user, logOut } = useContext(AuthContext) || {};

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error))
    }

    const AdminLinks = (
        <>
            <li>
                <NavLink to="/dashboard" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHome /> <span>Admin Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/profile" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHome /> <span>Admin Profile</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/all-users" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaUsers /> <span>All Users</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/all-blood-donation-request" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaList /> <span>All Donation Requests</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/content-management" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaList /> <span>Content Management</span>
                </NavLink>
            </li>
        </>
    );

    const DonorLinks = (
        <>
            <li>
                <NavLink to="/dashboard" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHome /> <span>Donor Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/profile" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHome /> <span>Donor Profile</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/my-donation-requests" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaList /> <span>My Donation Requests</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/create-donation-request" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaList /> <span>Create Donation Request</span>
                </NavLink>
            </li>
        </>
    );

    const VolunteerLinks = (
        <>
            <li>
                <NavLink to="/dashboard" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHome /> <span>Volunteer Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/profile" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHome /> <span>Volunteer Profile</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/all-blood-donation-request" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaList /> <span>All Donation Requests</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/content-management" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                    <FaHeart /> <span>Content Management</span>
                </NavLink>
            </li>
        </>
    );

    let links;
    if (isAdmin) {
        links = AdminLinks;
    } else if (isDonor) {
        links = DonorLinks;
    } else if (isVolunteer) {
        links = VolunteerLinks;
    }

    return (
        <div className="flex">
            {/* Dashboard sidebar */}
            <div className="w-64 min-h-screen bg-gray-800 text-gray-200">
                <ul className="menu py-12 px-5 space-y-4">
                    {links}

                    {/* Shared nav links */}
                    <div className="divider bg-gray-600"></div>
                    <li>
                        <NavLink to="/" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                            <FaHome /> <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/order/salad" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                            <FaSearch /> <span>Menu</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/order/contact" className="flex items-center space-x-2 text-gray-200 hover:text-white">
                            <FaEnvelope /> <span>Contact</span>
                        </NavLink>
                    </li>
                   <Link to="/login"> <li><a onClick={handleLogOut} >Logout</a></li></Link>
                </ul>
                
              
            </div>
            {/* Dashboard content */}
            <div className="flex-1 p-8 bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
};
