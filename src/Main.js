import React from 'react';
import './index.css';
import App from './App';
import Login from "./folderCollection/login";
import Signup from "./folderCollection/signup";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthContextProvider } from './folderCollection/AuthContext';
import './App.css'
import { ChatContextProvider } from './folderCollection/ChatContext';


export default function Render() {
    const currentUser = React.useContext(AuthContext)
    return (
        <AuthContextProvider>
            <ChatContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />}/>
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                    </Routes>
                </BrowserRouter>
            </ChatContextProvider>    
        </AuthContextProvider>
    )
}