import Image from 'next/image'
import TopMenuItem from './TopMenuItem'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function TopMenu() {
    return (
        <div className="w-full h-[60px] bg-white flex flex-row justify-between items-center z-50 fixed top-0 left-0 right-0">
            <div className="flex items-center">
                <Link href={'/'} className="flex flex-row items-center">
                    <Image src={'/img/logo.png'} alt='logo' width={0} height={0} sizes='100vh'
                        className="w-auto h-auto max-w-[70px] max-h-[70px] pl-4"/>
                    <Image src={'/img/logoText.png'} alt='logo text' width={0} height={0} sizes='100vh'
                        className="w-auto h-[60%] pl-3"/>
                </Link>
            </div>
            <div className="flex items-center">
                <TopMenuItem title='Home' pageRef='/'/>
                <TopMenuItem title='Restaurants' pageRef='/restaurants'/>
                <TopMenuItem title='Reservations' pageRef='/reservations'/>

                <Link href={'/user'}>
                    <UserCircleIcon className="w-[70px] h-[70px] ml-1 pr-4 text-[#d42d2d] hover:text-myred" />
                    {/*<Image src={'/img/profile.png'} alt='logo text' width={0} height={0} sizes='100vh'
                        className="w-auto h-auto max-w-[60px] max-h-[60px] object-contain pl-2 pr-2"/>*/}
                </Link>
            </div>
        </div>
    )
}