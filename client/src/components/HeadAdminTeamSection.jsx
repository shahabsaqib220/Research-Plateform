import React, { useEffect, useState, useContext } from 'react';
import Footer from './Footer';
import { AuthContext } from '@/services/AuthContext';
import axiosInstance from '@/services/axiosInstance';
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"; 
import { MdErrorOutline, MdLockPerson } from "react-icons/md";
import { Skeleton } from '@mui/material';
import { IoPerson } from "react-icons/io5";
import { Dialog } from '@headlessui/react';
import { FaExclamationCircle } from 'react-icons/fa';
import { FiEdit, FiLock, FiX } from "react-icons/fi";

const HeadAdminTeamSection = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isPasswordToggleOn, setIsPasswordToggleOn] = useState(false); // Toggle for password fields
const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
// State for password validation error
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memberPassword, setMemberPassword] = useState(''); // State for group member's password
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false); // New state for update password modal
  const [selectedMember, setSelectedMember] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [headUserPassword, setHeadUserPassword] = useState('');
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isLoggedIn) {
        setError('You are not authorized to view this content. Please log in.');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axiosInstance.get('/groupmember/my-members');
        if (response.status === 200) {
          const members = response.data.members;
          const promises = members.map(async (member) => {
            try {
              const response = await axiosInstance.get(`/groupmember/head-user-group-member-profile-image/${member.profileImage}`, {
                responseType: 'blob',
              });
              if (response.status === 200 && response.data) {
                const url = URL.createObjectURL(response.data);
                return { ...member, profileImageUrl: url };
              } else {
                return member;
              }
            } catch (error) {
              console.error('Error fetching profile image:', error);
              return member;
            }
          });
          const updatedMembers = await Promise.all(promises);
          setMembers(updatedMembers);
        } else {
          setError('Failed to fetch members');
        }
      } catch (err) {
        setError('Error fetching members');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMembers();
  }, [isLoggedIn]);



  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
  const isUpdateButtonDisabled = isPasswordToggleOn && (passwordError || memberPassword !== confirmPassword);


  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    setIsRemoveModalOpen(false);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async () => {
    setPasswordError('');
    setIsLoadingPassword(true);

    const payload = {
      memberId: selectedMember._id,
      password,
      email: selectedMember.email,
    };

    try {
      const response = await axiosInstance.post('/groupmember/group-member-remove', payload);
      
      if (response.data.message === 'Invalid password') {
        setPasswordError('Invalid password. Please try again.');
      } else if (response.data.message === 'Member removed successfully') {
        setIsPasswordModalOpen(false);
        setIsSuccessModalOpen(true);
        setMembers(members.filter((member) => member._id !== selectedMember._id));
      }
    } catch (error) {
      if (error.response) {
        setPasswordError(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        setPasswordError('An error occurred while processing your request. Please try again.');
      }
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setFirstName(member.firstName);
    setLastName(member.lastName);
    setIsEditModalOpen(true);
  };

 

  // Function to handle updating the group member
  const handleUpdateMember = () => {
    const updatedFields = {
      memberId: selectedMember._id,
      firstName: firstName !== selectedMember.firstName ? firstName : undefined,
      lastName: lastName !== selectedMember.lastName ? lastName : undefined,
      password: isPasswordToggleOn ? memberPassword : undefined, // Log the member's password only if toggle is on
    };
  
    // Open the password modal for confirmation
    setIsUpdatePasswordModalOpen(true);
  };
  
  const handleUpdatePasswordSubmit = async () => {
    setErrorMessage(''); // Reset any previous error
    setIsLoadingPassword(true); // Start loading
  
    if (!headUserPassword || headUserPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      setIsLoadingPassword(false); // Stop loading
      return;
    }
  
    try {
      const updatedFields = {
        memberId: selectedMember._id,
        firstName: firstName !== selectedMember.firstName ? firstName : undefined,
        lastName: lastName !== selectedMember.lastName ? lastName : undefined,
        password: isPasswordToggleOn ? memberPassword : undefined,
        headPassword: headUserPassword,
      };
  
      const response = await axiosInstance.put(
        `/groupmember/group-member-update/${selectedMember._id}`,
        updatedFields
      );
  
      console.log('Group member updated successfully:', response.data);
  
      setIsUpdatePasswordModalOpen(false); // Close the modal
      setIsSuccessModalOpen(true); // Show success message
      setIsLoadingPassword(false); // Stop loading
    } catch (error) {
      console.error('Error updating group member:', error);
  
      // Display error message in the modal
      const errorMsg = error.response?.data?.message || 'Invalid password. Please try again.';
      setErrorMessage(errorMsg);
      setIsLoadingPassword(false); // Stop loading
    }
  };
  
  
  
  
  




  return (
    <>
      <div className="lg:ml-56 mb-5 pl-10 font-[sans-serif] mt-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 max-lg:max-w-2xl">
            <div className="col-span-2">
              <h1 className="text-2xl mt-8 font-semibold leading-none tracking-tight text-gray-900 md:text-3xl">
                Group Members{' '}
                <span className="underline underline-offset-3 decoration-4 decoration-blue-400">
                  Overview
                </span>
              </h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-16">
            {loading ? (
              Array(3).fill().map((_, index) => (
                <div key={index} className="max-w-[360px] h-auto py-5 pl-14 pr-4 bg-white border-2 rounded-3xl relative">
                  <Skeleton variant="circular" width={80} height={80} className="absolute -left-10 top-0 bottom-0 my-auto border-2" />
                  <div>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={16} />
                  </div>
                  <div className="mt-4">
                    <Skeleton variant="text" width="100%" height={16} />
                  </div>
                </div>
              ))
            ) : (
              members.map((member) => (
                <div key={member._id} className="max-w-[360px] h-auto py-5 pl-14 pr-4 bg-white border-2 rounded-3xl relative">
                  {member.profileImageUrl ? (
                   <img 
                   src={member.profileImageUrl} 
                   className="w-20 h-20 border-blue-400 rounded-full absolute -left-10 top-0 bottom-0 my-auto border-2 object-cover" 
                   alt={`${member.firstName} ${member.lastName}`} 
                 />
                 
                  ) : (
                    <div className="absolute -left-10 top-0 bottom-0 my-auto border-2 w-20 h-20 flex items-center justify-center rounded-full bg-gray-200">
                      <RxAvatar className="text-blue-400 w-10 h-10" />
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-gray-800 text-base font-bold">{`${member.firstName} ${member.lastName}`}</h4>
                      <p className="mt-1 text-xs text-gray-500">{member.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <AiOutlineEdit className="text-gray-500 text-xl hover:text-blue-500 cursor-pointer" onClick={() => handleEditClick(member)} />
                      <AiOutlineDelete className="text-gray-500 text-xl hover:text-red-500 cursor-pointer" onClick={() => handleRemoveClick(member)} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ div>

      {/* Remove Member Modal */}
      {isRemoveModalOpen && (
        <Dialog
          open={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-6 bg-black bg-opacity-50 backdrop-blur-lg">
            <Dialog.Panel
              className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl rounded-xl p-8 w-full max-w-lg transform transition-all duration-500"
            >
              <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Remove Member</h2>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove this member? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm font-medium hover:bg-gray-400 hover:shadow-md transition ease-in-out duration-300"
                  onClick={() => setIsRemoveModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-lg font-medium hover:bg-red-600 hover:shadow-xl transition ease-in-out duration-300"
                  onClick={handleConfirmRemove}
                >
                  Yes, Remove
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Password Modal for Removal */}
      {isPasswordModalOpen && (
        <Dialog
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-6 bg-black bg-opacity-50 backdrop-blur-lg">
            <Dialog.Panel
              className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl rounded-xl p-8 w-full max-w-lg transform transition-all duration-500"
            >
              <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Enter Password</h2>
              <p className="text-sm text-gray-600 mb-6">Please enter your password to confirm the removal of the member.</p>
              <input
                type="password"
                className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className="flex items-center p-3 bg-red-100 text-red-600 rounded-lg mb-4">
                  <FaExclamationCircle className="mr-2 text-xl" />
                  <p className="font-semibold text-sm">{passwordError}</p>
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm font-medium hover:bg-gray-400 hover:shadow-md transition ease-in-out duration-300"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-medium hover:bg-blue-600 hover:shadow-xl transition ease-in-out duration-300"
                  onClick={handlePasswordSubmit}
                  disabled={password.length < 8 || isLoadingPassword}
                >
                  {isLoadingPassword ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Edit Member Modal */}


{isEditModalOpen && (
  <Dialog
    open={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    className="fixed inset-0 z-50 overflow-y-auto"
  >
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <Dialog.Panel className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FiEdit className=" text-blue-600" />
          <h1 className=" text-md font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl ">Update <span className="underline underline-offset-3 decoration-3 decoration-blue-400 ">Group Member </span>Details!</h1>

          </h2>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
            <div className="relative flex items-center">
              <IoPerson className="absolute left-3 text-black text-xl" />
              <input
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
            <div className="relative flex items-center">
              <IoPerson className="absolute left-3 text-black text-xl" />
              <input
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              />
            </div>
          </div>

          {/* Toggle for Password Update */}
          <div className="flex items-center mb-5">
            <input
              type="checkbox"
              checked={isPasswordToggleOn}
              onChange={() => setIsPasswordToggleOn(!isPasswordToggleOn)}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-900">Enable Password Update</label>
          </div>

          {/* Password Field */}
          {isPasswordToggleOn && (
            <>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                <div className="relative flex items-center">
                  <MdLockPerson className="absolute left-3 text-black text-xl" />
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={memberPassword}
                    onChange={(e) => {
                      setMemberPassword(e.target.value);
                      if (!validatePassword(e.target.value)) {
                        setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
                      } else {
                        setPasswordError('');
                      }
                    }}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 ${passwordError ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                <div className="relative flex items-center">
                  <MdLockPerson className="absolute left-3 text-black text-xl" />
                  <input
                    type="password"
                    placeholder="Re-enter New Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (e.target.value !== memberPassword) {
                        setPasswordError('Passwords do not match.');
                      } else {
                        setPasswordError('');
                      }
                    }}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 ${passwordError ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end mt-8 gap-4">
          <button
            className="px-5 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </button>
          <button
      type="button"
      onClick={handleUpdateMember}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      disabled={isPasswordToggleOn && (passwordError || memberPassword !== confirmPassword)}
    >
      Update
    </button>
          
          

        </div>
          {passwordError && (
    <div className="flex items-center p-2 mt-3 bg-red-100 text-red-600 rounded-lg mb-4">
        <FaExclamationCircle className="mr-2 text-xl" />
        <p className="font-semibold text-sm">{passwordError}</p>
    </div>
)}
      </Dialog.Panel>
    </div>
  </Dialog>
)}

      {/* Update Password Modal */}
      {isUpdatePasswordModalOpen && (
  <Dialog
    open={isUpdatePasswordModalOpen}
    onClose={() => setIsUpdatePasswordModalOpen(false)}
    className="fixed inset-0 z-50 overflow-y-auto"
  >
    <div className="flex items-center justify-center min-h-screen px-6 bg-black bg-opacity-50 backdrop-blur-lg">
      <Dialog.Panel
        className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl rounded-xl p-8 w-full max-w-lg transform transition-all duration-500"
      >
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Enter Password</h2>
        <p className="text-sm text-gray-600 mb-6">Please enter your password to confirm the update of the member details.</p>
        <input
          type="password"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
          placeholder="Enter your password"
          value={headUserPassword} 
          onChange={(e) => setHeadUserPassword(e.target.value)} // Update state on change
        />
       {errorMessage && (
  <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-sm mb-4">
    <MdErrorOutline className="text-red-500 text-lg" />
    <p className="text-sm font-medium">{errorMessage}</p>
  </div>
)}

        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm font-medium hover:bg-gray-400 hover:shadow-md transition ease-in-out duration-300"
            onClick={() => setIsUpdatePasswordModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-lg font-medium hover:bg-blue-600 hover:shadow-xl transition ease-in-out duration-300"
            onClick={handleUpdatePasswordSubmit}
            disabled={isLoadingPassword} // Disable during loading
          >
            {isLoadingPassword ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)}





      {/* Success Modal */}
      {isSuccessModalOpen && (
  <Dialog
    open={isSuccessModalOpen}
    onClose={() => {
      setIsSuccessModalOpen(false); // Close the success modal
      setIsEditModalOpen(false); // Close the edit modal
    }}
    className="fixed inset-0 z-50 overflow-y-auto"
  >
    <div className="flex items-center justify-center min-h-screen px-6 bg-black bg-opacity-50 backdrop-blur-lg">
      <Dialog.Panel
        className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl rounded-xl p-8 w-full max-w-lg transform transition-all duration-500"
      >
        <h2 className="text-2xl font-extrabold text-green-600 mb-4">Success!</h2>
        <p className="text-sm text-gray-600 mb-6">The member details have been successfully updated.</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm font-medium hover:bg-gray-400 hover:shadow-md transition ease-in-out duration-300"
            onClick={() => {
              setIsSuccessModalOpen(false); // Close the success modal
              setIsEditModalOpen(false); // Close the edit modal
            }}
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)}



      <Footer />
    </>
  );
};

export default HeadAdminTeamSection;