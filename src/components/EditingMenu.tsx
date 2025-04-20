    "use client"

    import Box from '@mui/material/Box';
    import TextField from '@mui/material/TextField';
    import InputAdornment from '@mui/material/InputAdornment';
    import PermIdentityIcon from '@mui/icons-material/PermIdentity';
    import CallIcon from '@mui/icons-material/Call';
    import MailOutlineIcon from '@mui/icons-material/MailOutline';
    import LockIcon from '@mui/icons-material/Lock';
    import { User } from '../../interfaces';
    import { useState } from 'react';
    import Link from 'next/link';

    import editUserProfile from '@/libs/editUserProfile';

    export default function EditingMenu({token, user}: {token: string ,user: User}) {
        const [userData, setUserData] = useState<User>(user);
        const [hasChanges, setHasChanges] = useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setUserData((prevData) => ({
                ...prevData,
                [name]: value,
            }));

            setHasChanges(true);
        };

        const handCancle = () => {
            setUserData(user);
            alert('Cancle');
        };

        const handleSave = async () => {
            if(!hasChanges){
                alert('No changes made to save.');
                return;
            }

            try {
                if (!token) {
                    alert('Token not found. Please log in again.');
                    return;
                }
        
                const updated = {
                    name: userData.name,
                    tel: userData.tel,
                };

                if(!updated.name || !updated.tel) {
                    alert('Please fill in all fields.');
                    return;
                }
        
                const response = await editUserProfile(token, updated);
                alert('Data saved successfully.');
                console.log('Updated user:', response.data);
            } catch (error: any) {
                console.error(error);
                alert(error.message || 'An error occurred while saving the data.');
            }

            setHasChanges(false);
        };    

        return (
            <main>
                <div className="p-5 w-[70vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
                    <h2 className="text-xl font-bold mb-4">ข้อมูลส่วนตัว</h2>
                    <Box sx={{ '& > :not(style)': { m: 2 } }}>
                        <TextField
                            label="ชื่อ"
                            placeholder="Name"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PermIdentityIcon className='text-red-600' />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: { fontSize: '1.2rem' },
                            }}
                            variant="standard"
                            sx={{ width: '95%' }}
                        />
                        <TextField
                            label="เบอร์โทรศัพท์"
                            placeholder="Tel."
                            name="tel"
                            value={userData.tel}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CallIcon className='text-red-600' />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: { fontSize: '1.2rem' },
                            }}
                            variant="standard"
                            sx={{ width: '95%' }}
                        />
                        <TextField
                            label="อีเมล"
                            placeholder="Email"
                            value={userData.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutlineIcon className='text-red-600' />
                                    </InputAdornment>
                                ),
                                readOnly: true,
                            }}
                            variant="standard"
                            sx={{ width: '95%' }}
                        />
                        <div className="flex items-center w-[95%]">
                        <TextField
                            label="รหัสผ่าน"
                            placeholder="Password"
                            value={'********'}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <LockIcon className='text-red-600' />
                                </InputAdornment>
                            ),
                            readOnly: true,
                            }}
                            variant="standard"
                            sx={{ width: '89%' }}
                        />
                        <Link href="/user/changepassword" className='mt-4 ml-4 text-indigo-600 cursor-pointer hover:underline'>
                            แก้ไขรหัสผ่าน
                        </Link>
                        </div>                    
                    </Box>
                </div>
                <div className='flex flex-row justify-center'>
                    <button
                        onClick={handCancle}
                        className='mt-10 px-10 py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-400 hover:text-white shadow-lg'
                    >
                        ยกเลิกการเปลี่ยนแปลง
                    </button>
                    <button
                        onClick={handleSave}
                        className='ml-10 mt-10 px-10 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 hover:text-white shadow-lg'
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </main>
        );
    }
