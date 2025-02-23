'use client'

// components/ResearchName.jsx
import React from "react";
import { HiUserGroup } from "react-icons/hi";
import { PiSubtitlesFill } from "react-icons/pi";
import { SiCodeclimate } from "react-icons/si";
import { FaFileWord } from "react-icons/fa6";

const ResearchName = () => {
  return (
    <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
        <h2 class="text-4xl font-bold ">Payments tool for companies</h2>
         
        </div>

        {/* Research Name Form */}
        <div className="mt-8">
          <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 lg:p-10">
            <form className="space-y-6">
              {/* Research Group Title */}

         <div className="max-w-md mx-auto font-[sans-serif]">
  <labe className="mb-2 text-sm font-semibold text-black block">Research Group Title</labe>
  <div className="relative flex items-center h-12 border-2 border-[#007bff] rounded">
    <div className="bg-[#007bff] w-16 p-4 h-full flex items-center justify-center">
     <PiSubtitlesFill className="text-6xl text-black"/>
    </div>
    <input type="text" placeholder="E.g AI for Health Care...Etc" className="text-sm text-black rounded bg-white w-full h-full  outline-none px-4" />
  </div>
</div>

            

              {/* Research Acronym */}

              <div className="max-w-md mx-auto font-[sans-serif]">
  <labe className="mb-2 text-sm font-semibold text-black block">Group Acronym</labe>
  <div className="relative flex items-center h-12 border-2 border-[#007bff] rounded">
    <div className="bg-[#007bff] w-16 p-4 h-full flex items-center justify-center">
     <SiCodeclimate className="text-6xl text-black"/>
    </div>
    <input type="text" placeholder="E.g A14H.." className="text-sm text-black rounded bg-white w-full h-full  outline-none px-4" />
  </div>
</div>


              
              

              {/* Keywords */}


              <div className="max-w-md mx-auto font-[sans-serif]">
  <labe className="mb-2 text-sm font-semibold text-black block">Group Keyword</labe>
  <div className="relative flex items-center h-12 border-2 border-[#007bff] rounded">
    <div className="bg-[#007bff] w-16 p-4 h-full flex items-center justify-center">
     <FaFileWord className="text-3xl text-black"/>
    </div>
    <input type="text" placeholder="E.g A14H.." className="text-sm text-black rounded bg-white w-full h-full  outline-none px-4" />
  </div>
</div>

<div className="max-w-md mx-auto font-[sans-serif]">
      {/* Label for Textarea */}
      <label
        htmlFor="keywordTextarea"
        className="mb-2 text-sm font-semibold text-black block"
      >
        Group Keyword
      </label>

      {/* Textarea Wrapper */}
      <div className="relative flex items-start border-2 border-[#007bff] rounded">
        {/* Icon Section */}
        <div className="bg-[#007bff] w-16 p-4 h-full flex items-center justify-center">
          <FaFileWord className="text-3xl text-black" />
        </div>

        {/* Textarea */}
        <textarea
          id="keywordTextarea"
          placeholder="E.g. Enter keywords or description..."
          rows="4"
          className="text-sm text-black rounded bg-white w-full h-full outline-none px-4 py-2 resize-none"
        ></textarea>
      </div>
    </div>
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700"
                >
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  placeholder="e.g., Artificial Intelligence, Healthcare"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Save Research Name
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchName;
