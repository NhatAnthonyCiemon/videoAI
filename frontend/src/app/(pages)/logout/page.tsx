"use client";
import React from "react";

function LogoutPage() {
    React.useEffect(() => {
        fetch("/api/logout", {
            method: "GET",
        }).then((response) => {
            if (response.ok) {
                window.location.href = "http://localhost:3000/";
            }
        });
    }, []);
    return <div>Logging out...</div>;
}

export default LogoutPage;
