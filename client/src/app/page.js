'use client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UploadResearchForm from "./uploadreseachpapers/page";

import HomePageTimeLine from "@/app/home-page-reseach-timeline/page"

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
    <Navbar/>
 
    <HomePageTimeLine/>
    
   
      <Footer isSidebarOpen={isSidebarOpen} />
    
    
    </>
  
  );
}
