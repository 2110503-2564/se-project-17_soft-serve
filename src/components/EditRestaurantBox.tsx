'use client'
import { useState, useEffect } from "react";
import getRestaurant from "@/libs/getRestaurant";
import getUserProfile from "@/libs/getUserProfile";
import editRestaurant from "@/libs/editRestaurant";
import { OneRestaurantJson, RestaurantItem } from "../../interfaces";
import { PencilIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Loader from "./Loader";
import Manager from "@/app/(restaurantmanagerinfo)/manager/page";

export default function EditRestaurantBox({ restaurantId, token }: { restaurantId: string, token: string }) {
  const router = useRouter();
  const [isManager, setIsManager] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getUserProfile(token);
      const isManager = user.data.role === 'restaurantManager';
      const isAdmin = user.data.role === 'admin';
      setIsManager(isManager);
      setIsAdmin(isAdmin);
      if (!(isManager || isAdmin)) {
        router.push('/');
      }
    }
    fetchProfile();
  }, [token, router]);

  const [restaurant, setRestaurant] = useState<OneRestaurantJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editProvince, setEditProvince] = useState('');
  const [editPostalcode, setEditPostalcode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFoodType, setEditFoodType] = useState('');
  const [editOpenTime, setEditOpenTime] = useState('');
  const [editCloseTime, setEditCloseTime] = useState('');
  const [editTel, setEditTel] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (restaurantId) {
        try {
          const fetchedRestaurant = await getRestaurant(restaurantId.toString());
          if (fetchedRestaurant) {
            setRestaurant(fetchedRestaurant);
            // Initialize edit states with current data
            setEditAddress(fetchedRestaurant.data.address);
            setEditDistrict(fetchedRestaurant.data.district);
            setEditProvince(fetchedRestaurant.data.province);
            setEditPostalcode(fetchedRestaurant.data.postalcode);
            setEditDescription(fetchedRestaurant.data.description);
            setEditFoodType(fetchedRestaurant.data.foodType);
            setEditOpenTime(fetchedRestaurant.data.openTime);
            setEditCloseTime(fetchedRestaurant.data.closeTime);
            setEditTel(fetchedRestaurant.data.tel);
          } else {
            setError("Restaurant not found");
          }
        } catch (err) {
          setError("Failed to load restaurant data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(editOpenTime)) {
      alert('Open Time must be in the format hh:mm');
      return;
    }
    if (!timeRegex.test(editCloseTime)) {
      alert('Close Time must be in the format hh:mm');
      return;
    }

    if(!editAddress || !editDistrict || !editProvince || !editPostalcode || !editDescription || !editFoodType || !editTel) {
      if(!editAddress) {
        alert('Address is required');
      }else if(!editDistrict) {
        alert('District is required');
      }else if(!editProvince) {
        alert('Province is required');
      }else if(!editPostalcode) {
        alert('Postal Code is required');
      }else if(!editFoodType) {
        alert('Food Type is required');
      }else if(!editOpenTime) {
        alert('Open Time is required');
      }else if(!editCloseTime) {
        alert('Close Time is required');
      }else if(!editTel) {
        alert('Tel is required');
      }
      return ;
    }

    const updatedData = {
      description: editDescription,
      foodType: editFoodType,
      address: editAddress,
      province: editProvince,
      district: editDistrict,
      postalcode: editPostalcode,
      tel: editTel,
      openTime: editOpenTime,
      closeTime: editCloseTime
    } as RestaurantItem;
    try {
      // console.log("Updated Data:", updatedData);
      await editRestaurant({restaurantId: restaurantId, description: editDescription, foodType: editFoodType, address: editAddress, province: editProvince, district: editDistrict, postalcode: editPostalcode, tel: editTel, openTime: editOpenTime, closeTime: editCloseTime, token});
      if (restaurant?.data) {
        const updatedRestaurant = { ...restaurant, data: { ...restaurant.data, ...updatedData } };
        setRestaurant(updatedRestaurant as OneRestaurantJson);
        setIsEditing(false);
        alert('Restaurant updated successfully!');
        if (isAdmin) {
          router.push('/admin/restaurants');
        }
        if (isManager) {
          router.push(`/restaurants/own/${restaurantId}`);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to edit restaurant. Please try again.');
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (restaurant && restaurant.data) {
      setEditAddress(restaurant.data.address || '');
      setEditDistrict(restaurant.data.district || '');
      setEditProvince(restaurant.data.province || '');
      setEditPostalcode(restaurant.data.postalcode || '');
      setEditDescription(restaurant.data.description || '');
      setEditFoodType(restaurant.data.foodType || '');
      setEditOpenTime(restaurant.data.openTime || '');
      setEditCloseTime(restaurant.data.closeTime || '');
      setEditTel(restaurant.data.tel || '');
    }
  };
  if (loading) {
    return <Loader loadingtext="Loading Restaurant..." />;
  }
  if (error) {
    return <div className="m-5 text-white text-xl">{error}</div>;
  }
  if (!restaurant || !restaurant.data) {
    return <div className="m-5 text-white text-xl">Invalid Restaurant ID</div>;
  }

  return (
    <div className="flex flex-col p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto">
      <div className="flex justify-center items-center mt-8 mb-4">
        <Image src={restaurant.data.imgPath} alt={restaurant.data.name} width={300} height={300} className="rounded-lg"/>                    
      </div>
      <div className="text-3xl text-center font-bold text-myred my-5">{restaurant.data.name}</div>
      <div className="px-12 py-2">
        {/*Address*/}
        <div className="font-semibold text-myred text-xl mb-2">
          Address
        </div>
        <div className="text-gray-700 border-b border-gray-300">
          {isEditing ? (
          <div className="flex flex-col gap-2 p-1">
          <label htmlFor="editAddress" className="text-sm text-gray-600">Address:</label>
          <input
            type="text"
            id="editAddress"
            className="w-full p-1 border border-gray-300 rounded"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
          />
          <label htmlFor="editDistrict" className="text-sm text-gray-600">District:</label>
          <input
            type="text"
            id="editDistrict"
            className="w-full p-1 border border-gray-300 rounded"
            value={editDistrict}
            onChange={(e) => setEditDistrict(e.target.value)}
          />
          <label htmlFor="editProvince" className="text-sm text-gray-600">Province:</label>
          <input
            type="text"
            id="editProvince"
            className="w-full p-1 border border-gray-300 rounded"
            value={editProvince}
            onChange={(e) => setEditProvince(e.target.value)}
          />
          <label htmlFor="editPostalcode" className="text-sm text-gray-600">Postal Code:</label>
          <input
            type="text"
            id="editPostalcode"
            className="w-full p-1 border border-gray-300 rounded"
            value={editPostalcode}
            onChange={(e) => setEditPostalcode(e.target.value)}
          />
        </div>
      ) : (
      <div className="flex justify-between items-center p-1">
        <span>{restaurant.data.address}, {restaurant.data.district}, {restaurant.data.province}, Thailand {restaurant.data.postalcode}</span>
        <PencilIcon className="text-gray-600 hover:text-gray-800 h-5 w-5 mr-2 cursor-pointer" onClick={handleEditClick} />
      </div>
      )}
      </div>
        {/*Description*/}
        <div className="font-semibold text-myred text-xl mt-5 mb-2">
          Description
        </div>
        <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
          {isEditing ? (
            <textarea
              className="w-full p-1"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          ) : (
            <span>{restaurant.data.description}</span>
          )}
          {!isEditing && <PencilIcon className="text-gray-600 hover:text-gray-800 h-5 w-5 mr-2 cursor-pointer" onClick={handleEditClick} />}
        </div>
        {/*Food Type*/}
        <div className="font-semibold text-myred text-xl mt-5 mb-2">
          Food Type
        </div>
        <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              className="w-full p-1"
              value={editFoodType}
              onChange={(e) => setEditFoodType(e.target.value)}
            />
          ) : (
            <span>{restaurant.data.foodType}</span>
          )}
          {!isEditing && <PencilIcon className="text-gray-600 hover:text-gray-800 h-5 w-5 mr-2 cursor-pointer" onClick={handleEditClick} />}
        </div>
        {/*Opening Hours*/}
        <div className="font-semibold text-myred text-xl mt-5 mb-2">
          Opening Hours
        </div>
        <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
          {isEditing ? (
            <>
            <div className="flex flex-col w-1/2 mr-2">
            <label className="text-sm text-gray-600">Open Time:</label>
              <input
                type="text"
                className="w-full p-1"
                placeholder="Open Time"
                value={editOpenTime}
                onChange={(e) => setEditOpenTime(e.target.value)}
              />
            </div>
            <span className="mx-2">-</span>
            <div className="flex flex-col w-1/2 mr-2">
            <label className="text-sm text-gray-600">Close Time:</label>
              <input
                type="text"
                className="w-full p-1"
                placeholder="Close Time"
                value={editCloseTime}
                onChange={(e) => setEditCloseTime(e.target.value)}
              />
            </div>
            </>
          ) : (
            <span>{restaurant.data.openTime} - {restaurant.data.closeTime}</span>
          )}
          {!isEditing && <PencilIcon className="text-gray-600 hover:text-gray-800 h-5 w-5 mr-2 cursor-pointer" onClick={handleEditClick} />}
        </div>
        {/*Tel*/}
        <div className="font-semibold text-myred text-xl mt-5 mb-2">
          Tel
        </div>
        <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              className="w-full p-1"
              value={editTel}
              onChange={(e) => setEditTel(e.target.value)}
            />
          ) : (
            <span>{restaurant.data.tel}</span>
          )}
          {!isEditing && <PencilIcon className="text-gray-600 hover:text-gray-800 h-5 w-5 mr-2 cursor-pointer" onClick={handleEditClick} />}
        </div>
      </div>
      {/*Submit/Cancel Buttons*/}
      <div className="flex justify-center">
        {isEditing ? (
          <>
            <button
              className='w-[140px] block bg-mygray border border-white text-white text-xl font-semibold py-2 px-10 m-5 rounded-xl shadow-sm hover:shadow-2xl hover:bg-white hover:text-mygray hover:border hover:border-mygray'
              onClick={handleCancelClick}>
              Cancel
            </button>
            <button
              className='w-[140px] block bg-myred border border-white text-white text-xl font-semibold py-2 px-10 m-5 rounded-xl shadow-sm hover:shadow-2xl hover:bg-white hover:text-myred hover:border hover:border-myred'
              onClick={handleSaveClick}>
              Save
            </button>
          </>
        ) : (
          <button onClick={handleEditClick} className='w-[140px] block bg-mygray border border-white text-white text-xl font-semibold py-2 px-10 m-5 rounded-xl shadow-sm hover:shadow-2xl hover:bg-white hover:text-mygray hover:border hover:border-mygray'>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}