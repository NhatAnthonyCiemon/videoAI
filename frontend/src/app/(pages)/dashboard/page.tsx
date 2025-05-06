import Category from "./Catery";
import Search from "./Search";
import Videos from "./Videos";

function Dashboard() {
    return (
        <div className="py-[50px] w-[1280px] mx-auto">
            <Search />
            <Category />
            <Videos />
        </div>
    );
}

export default Dashboard;
