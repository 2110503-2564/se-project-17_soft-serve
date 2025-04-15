import VerifyCard from "@/components/AdminVerifyCard";

export default function Verify() {
    return (
        <main>
            <div className="flex flex-col pl-7 space--5 bg-myred pb-7 text-3xl font-bold text-white pt-7">
                Verify Restaurant Accounts
            </div>
            <div>
                <VerifyCard/>
            </div>
        </main>
    );
}