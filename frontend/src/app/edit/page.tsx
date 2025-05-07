import Header from "@/components/layout/header";
import EditVideo from "./EditVideo";
function Edit() {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <Header />
            <EditVideo />
        </div>
    );
}

export default Edit;
