import Header from "@/components/layout/header";
import EditVideo from "./EditVideo";
function Edit() {
    return (
        <div className="overflow-hidden h-screen">
            <Header />
            <div className="flex flex-col h-screen w-screen overflow-hidden">
                <EditVideo />
            </div>
        </div>
    );
}

export default Edit;
