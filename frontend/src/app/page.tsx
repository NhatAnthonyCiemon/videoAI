import Button from "./Button";

export default function Home() {
    return (
        <div className="flex">
            {/* left side */}
            <div className="w-1/2">
                {/* video player */}
                <div className="w-full h-full">
                    <Button />
                </div>
            </div>
        </div>
    );
}
