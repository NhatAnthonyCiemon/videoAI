"use client";
import { createContext, useContext, useState } from "react";
import User from "../types/User";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
    user,
    children,
}: {
    user: User | null;
    children: React.ReactNode;
}) {
    const [currentUser, setCurrentUser] = useState<User | null>(user);

    return (
        <UserContext.Provider
            value={{ user: currentUser, setUser: setCurrentUser }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
