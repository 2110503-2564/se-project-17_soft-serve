'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantManagerRegisterPage() {
  // User information state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tel, setTel] = useState('');
  
  // Restaurant information state
  const [restaurantName, setRestaurantName] = useState('');
  const [foodType, setFoodType] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [restaurantTel, setRestaurantTel] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [imgPath, setImgPath] = useState('');
  
  // UI control state
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  /**
   * Validates personal information fields
   * @returns {boolean} - Returns true if all validations pass
   */
  const validatePersonalInfo = () => {
    // Check for empty fields
    if (!name || !email || !password || !confirmPassword || !tel) {
      alert('Please fill in all personal information fields');
      return false;
    }

    // Validate password length
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return false;
    }

    // Validate password matching
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    
    return true;
  };

  /**
   * Validates restaurant information fields
   * @returns {boolean} - Returns true if all validations pass
   */
  const validateRestaurantInfo = () => {
    // Check for empty fields
    if (!restaurantName || !foodType || !address || !province || 
        !district || !postalcode || !openTime || !closeTime) {
      alert('Please fill in all required restaurant information fields');
      return false;
    }

    // Validate postal code format
    if (postalcode.length !== 5 || !/^\d+$/.test(postalcode)) {
      alert('Postal code must be exactly 5 digits');
      return false;
    }

    // Validate time format
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(openTime) || !timePattern.test(closeTime)) {
      alert('Opening and closing times must be in the format HH:MM (24-hour format)');
      return false;
    }
    
    // Check if openTime is before closeTime
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    if (closeHour < openHour || (closeHour === openHour && closeMinute <= openMinute)) {
      alert('Closing time must be after opening time');
      return false;
    }
    
    return true;
  };


  const deleteRestaurant = async (restaurantId:string) => {
    try {
      console.log('Attempting to delete restaurant due to user creation failure');
      const deleteResponse = await fetch(`${process.env.BACKEND_URL}api/v1/restaurants/system/${restaurantId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json','X-System-API-Key': 'whythisprojectsohard' },
      });
      
      if (!deleteResponse.ok) {
        console.error('Failed to delete restaurant:', await deleteResponse.text());
      } else {
        console.log('Restaurant deleted successfully after user creation failure');
      }
    } catch (deleteError) {
      console.error('Error while trying to delete restaurant:', deleteError);
    }
  };

  // Tab navigation handlers
  const handleNextClick = () => {
    if (validatePersonalInfo()) {
      setActiveTab('restaurant');
    }
  };

  const handleBackClick = () => {
    setActiveTab('personal');
  };

  /**
   * Form submission handler
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If on personal tab, move to restaurant tab instead of submitting
    if (activeTab === 'personal') {
      handleNextClick();
      return;
    }

    // Validate all information before submission
    if (!validatePersonalInfo() || !validateRestaurantInfo()) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submission started');
      
      let restaurantId = null;

      // First create the restaurant
      const restaurantResponse = await fetch(`${process.env.BACKEND_URL}api/v1/restaurants/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: restaurantName,
          foodType,
          address,
          province,
          district,
          postalcode,
          tel: restaurantTel,
          openTime,
          closeTime,
          imgPath: imgPath || undefined
        })
      });
      
      console.log('Restaurant response status:', restaurantResponse.status);

      if (!restaurantResponse.ok) {
        const errorText = await restaurantResponse.text();
        console.error('Restaurant creation failed. Server response:', errorText);
        throw new Error(errorText || 'Failed to create restaurant');
      }

      const restaurantData = await restaurantResponse.json();
      console.log('Restaurant creation response:', restaurantData);
      restaurantId = restaurantData.data._id;
      
      if (!restaurantId) {
        throw new Error('Failed to get restaurant ID');
      }
      
      // Register the user as restaurant manager
      console.log('Attempting to create user...');

      try {
        const userResponse = await fetch(`${process.env.BACKEND_URL}api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            tel,
            role: "restaurantManager",
            verified: false,
            restaurant: restaurantId
          })
        });
        
        if (!userResponse.ok) {
          let errorText;
          try {
            errorText = await userResponse.text();
            console.error('User registration error (raw):', errorText);
            const errorData = JSON.parse(errorText);
            
            // If user creation fails, delete the restaurant that was just created
            if (restaurantId) {
              await deleteRestaurant(restaurantId);
            }
            
            throw new Error(errorData.message || errorData.msg || 'Registration failed');
          } catch (jsonError) {
            // If user creation fails, delete the restaurant that was just created
            if (restaurantId) {
              await deleteRestaurant(restaurantId);
            }
            
            console.error('Failed to parse error response:', jsonError);
            throw new Error(`Server error: ${errorText || 'Unknown error'}`);
          }
        }

        alert('Registration submitted! Your account will be verified by an administrator.');
        router.replace('/login');
      } catch (userError) {
        // Rethrow the error after attempting to delete restaurant
        throw userError;
      }
    } catch (err:any) {
      console.error('Error registering restaurant manager:', err);
      alert(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input field styles
  const inputClass = "w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800";
  const buttonClass = "block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:opacity-50";
  const secondaryButtonClass = "block bg-gray-300 border border-gray-300 text-gray-800 text-xl font-semibold w-[150px] py-2 px-4 rounded-xl shadow-sm hover:bg-gray-400 disabled:opacity-50";

  // Render personal information form fields
  const renderPersonalInfoForm = () => (
    <div className="space-y-6">
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setName(e.target.value)} 
          type="text" 
          id="name" 
          placeholder="Full Name"
          value={name}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setEmail(e.target.value)} 
          type="email" 
          id="email" 
          placeholder="Email"
          value={email}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setTel(e.target.value)} 
          type="tel" 
          id="tel" 
          placeholder="Phone Number"
          value={tel}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          id="password" 
          placeholder="Password"
          value={password}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          type="password" 
          id="confirm-password" 
          placeholder="Confirm Password"
          value={confirmPassword}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col justify-center items-center mt-8">
        <button 
          type="button" 
          onClick={handleNextClick}
          disabled={isSubmitting}
          className={buttonClass}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render restaurant information form fields
  const renderRestaurantInfoForm = () => (
    <div className="space-y-6">
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setRestaurantName(e.target.value)} 
          type="text" 
          id="restaurant-name" 
          placeholder="Restaurant Name"
          value={restaurantName}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setFoodType(e.target.value)} 
          type="text" 
          id="food-type" 
          placeholder="Food Type (e.g., Italian, Thai, Japanese)"
          value={foodType}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setAddress(e.target.value)} 
          type="text" 
          id="address" 
          placeholder="Address"
          value={address}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setProvince(e.target.value)} 
          type="text" 
          id="province" 
          placeholder="Province"
          value={province}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setDistrict(e.target.value)} 
          type="text" 
          id="district" 
          placeholder="District"
          value={district}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setPostalcode(e.target.value)} 
          type="text" 
          id="postalcode" 
          placeholder="Postal Code (5 digits)"
          value={postalcode}
          maxLength={5}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setRestaurantTel(e.target.value)} 
          type="tel" 
          id="restaurant-tel" 
          placeholder="Restaurant Phone Number"
          value={restaurantTel}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      
      {/* Opening/Closing Time Fields */}
      <div className="flex justify-center space-x-4 w-4/5 mx-auto">
        <div className="flex-1">
          <label htmlFor="open-time" className="block text-sm font-medium text-gray-700 mb-1">
            Opening Time
          </label>
          <input 
            onChange={(e) => setOpenTime(e.target.value)} 
            type="time" 
            id="open-time" 
            value={openTime}
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-1"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="close-time" className="block text-sm font-medium text-gray-700 mb-1">
            Closing Time
          </label>
          <input 
            onChange={(e) => setCloseTime(e.target.value)} 
            type="time" 
            id="close-time" 
            value={closeTime}
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-1"
          />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <input 
          onChange={(e) => setImgPath(e.target.value)} 
          type="text" 
          id="img-path" 
          placeholder="Restaurant Image URL (Optional)"
          value={imgPath}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      {/* Back and Register Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button 
          type="button" 
          onClick={handleBackClick}
          disabled={isSubmitting}
          className={secondaryButtonClass}
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={buttonClass}
        >
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>
      </div>
    </div>
  );

  return (
    <main className="bg-myred min-h-[calc(100vh-60px)] flex justify-center items-center flex-col px-4 md:px-20 lg:px-80 pt-[80px] pb-10 overflow-auto">
      <div className="w-full bg-white text-gray-800 py-10 px-6 md:px-20 rounded-3xl shadow-2xl relative">
        <div className="text-3xl font-bold text-center mt-6 mb-12">
          Create Restaurant Manager Account
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mb-8 border-b">
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'personal' ? 'border-b-2 border-myred text-myred font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('personal')}
            disabled={isSubmitting}
          >
            Personal Information
          </button>
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'restaurant' ? 'border-b-2 border-myred text-myred font-semibold' : 'text-gray-500'}`}
            onClick={() => validatePersonalInfo() && setActiveTab('restaurant')}
            disabled={isSubmitting}
          >
            Restaurant Information
          </button>
        </div>
        
        {/* Form with conditional rendering of tab content */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'personal' && renderPersonalInfoForm()}
          {activeTab === 'restaurant' && renderRestaurantInfoForm()}
        </form>

        {/* Login Link */}
        <div className="text-center text-slate-500 mt-8">
          Already have an account?
          <Link href="/login" className="text-slate-800 hover:underline ml-2">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}