'use client';

import { useState } from "react";
import GroupMemberDashboardProfile from "@/components/GroupMemberDashoardProfile";
import EducationalBackground from "@/components/GroupMemberQualifications"; // Ensure this path is correct
import { FaUser , FaBook, FaResearchgate, FaBars } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GroupMemberContributions from "@/components/GroupMemberContributions";
import PersonalPublicationForm from "@/components/GroupMemberPersonalPublications";


export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Profile");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Profile", icon: <FaUser  /> },
    { name: "Education", icon: <FaBook /> },
    { name: "Contributions", icon: <FaResearchgate /> },
    { name: "Personal Publications", icon: <FaResearchgate /> },
  ];

  // Dynamically render the selected component
  const renderComponent = () => {
    switch (activeMenu) {
      case "Profile":
        return <div className="p-6"><GroupMemberDashboardProfile /></div>;
      case "Education":
        return <div className="p-6"><EducationalBackground /></div>; // Ensure the component returns valid JSX
      case "Contributions":
        return <div className="p-6"><GroupMemberContributions/></div>;
      case "Personal Publications":
        return <div className="p-6"><PersonalPublicationForm/></div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex w-full h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 w-64 z-30`}
        >
          <div className="p-4 text-lg font-bold">Dashboard</div>
          <ul className="mt-4">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                  activeMenu === item.name ? "bg-gray-900" : ""
                }`}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSidebarOpen(false); // Close sidebar when an item is selected
                }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 sm:ml-64 relative z-10"> {/* Set z-index for content */}
          <div className="flex items-center justify-between p-4 bg-white shadow-sm sm:hidden">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-800"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </div>
          {renderComponent()}
        </div>
        
     
      </div>
      <Footer/>
 
    
      
      
     
    </>
  );
}