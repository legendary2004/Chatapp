import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";

export const AuthContext = React.createContext(null);

export const AuthContextProvider = ({children}) => {
    
    const [currentUser, setCurrentUser] = React.useState("");

    React.useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return () => {
            unsub()
        }
    })

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}