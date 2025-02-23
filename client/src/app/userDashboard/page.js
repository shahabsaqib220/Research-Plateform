'use client'

import React, { useState } from 'react';
import ProfileImageUpload from '@/app/userDashboardLiItems/page'; // Import the ProfileImageUpload component
import Navbar from '@/components/Navbar';
import Person2Icon from '@mui/icons-material/Person2';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Groups2Icon from '@mui/icons-material/Groups2';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AdminPersonallnformation from '@/components/AdminUserPersonalInfo';
import HeadAdminTeamSection from '@/components/HeadAdminTeamSection';
import Footer from '@/components/Footer';
import ResearchGroupForm from '@/components/ResearchGroupForm';
import AdminAddMembersFrom from '@/components/AdminAddMembersFrom';
const AdminUserDashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState(''); // State to track active component

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return (
          <div>
            {/* Render Profile Image Upload */}
            <ProfileImageUpload />
            {/* Render Personal Information */}
            <AdminPersonallnformation />
          </div>
        );
      case 'researchGroup':
        return (
          <div>
          <ProfileImageUpload />
          <ResearchGroupForm/>
          </div>
        )
      case 'members':
        return (
          <div>
          <ProfileImageUpload />
          <AdminAddMembersFrom/>
          </div>
        )
      case 'audience':
        return (
          <div>
          <ProfileImageUpload />
          <HeadAdminTeamSection/>
          </div>
         
        )
      default:
        return (
          <div>
          {/* Render Profile Image Upload */}
          <ProfileImageUpload />
          {/* Render Personal Information */}
          <AdminPersonallnformation />
        
        </div>
        )
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-800 transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  onClick={() => {
                    setActiveComponent('profile');
                    setIsOpen(false); // Close sidebar on small screens
                  }}
                  className="flex w-full ml-3 items-center p-2 text-white rounded-lg hover:bg-black"
                >
                  <Person2Icon className="text-blue-500 mr-3" />
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveComponent('researchGroup');
                    setIsOpen(false); // Close sidebar on small screens
                  }}
                  className="flex w-full ml-3 items-center p-2 text-white rounded-lg hover:bg-black"
                >
                  <ImportContactsIcon className="text-blue-500 mr-3" />
                  Research Group
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveComponent('members');
                    setIsOpen(false); // Close sidebar on small screens
                  }}
                  className="flex w-full ml-3 items-center p-2 text-white rounded-lg hover:bg-black"
                >
                  <GroupAddIcon className="text-blue-500 mr-3" />
                  Add A Member
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveComponent('audience');
                    setIsOpen(false); // Close sidebar on small screens
                  }}
                  className="flex w-full ml-3 items-center p-2 text-white rounded-lg hover:bg-black"
                >
                  <Groups2Icon className="text-blue-500 mr-3" />
                  View Members
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 transition-all duration-200">{renderComponent()}</main>

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 p-2 bg-blue-500 text-white rounded-full lg:hidden"
        >
          <FormatListBulletedIcon />
        </button>
      </div>
    </>
  );
};

export default AdminUserDashboardSidebar;
