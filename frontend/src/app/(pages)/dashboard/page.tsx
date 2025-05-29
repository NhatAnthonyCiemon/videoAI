import Header from "@/components/layout/header";
import Category from "./Catery";
import Search from "./Search";
import Videos from "./Videos";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FilterProvider } from "./FilterContext";

export const dynamic = "force-dynamic";

async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token || token.trim() === "") {
        redirect("/login");
    }

    return (
        <FilterProvider>
            <Header />
            <div className="py-[50px] w-[1280px] mx-auto">
                <Search />
                <Category />
                <Videos />
            </div>
        </FilterProvider>
    );
}

export default Dashboard;