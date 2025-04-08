import Image from "next/image";
export default function SearchBox() {
    return(
        <div className="flex-grow flex justify-end mx-10">
            <div className="relative w-[30%]">
                <input className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full pl-10"
                    type="text" placeholder="Search" />
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    src="/icons/search_icon.png" alt="Search Icon" width={15} height={15} />
            </div>
        </div>
    );
}