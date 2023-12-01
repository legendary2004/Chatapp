import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export default function() {
    let navigate = useNavigate();
    let [message, setMessage] = React.useState("");
    let [error, setError] = React.useState("")
    let [user, setUser] = React.useState({email: "", pass: ""})
    function signupNavigate(path) {
        navigate(path, {replace: true})
    }
    function changeUser(e) {
        let id = e.target.id;
        let value = e.target.value;
        setUser({
            ...user,
            [id]: value
        })
    }
    async function getUsers() {
        try {
            setError('')
            await signInWithEmailAndPassword(auth, user.email, user.pass)
        }
        catch(err) {
            console.log(err.code)
            setError(err.code)
        }
    }

    React.useEffect(() => {
        if (error === 'auth/invalid-login-credentials') setMessage("Wrong email or password")
        if (error == 'auth/invalid-email') setMessage("Not valid email")
        if (error === 'auth/missing-password') setMessage("Password cannot be empty")
        if (!error) setMessage(<div>Logged in. Click <a href="#" onClick={() => signupNavigate("/")} data-bs-dismiss="modal">here</a> to continue chatting</div>)
    }, [error])
    return (
        <div className="body">
            <div className="container form">
                <div className="mb-3">
                    <input type="email" className="form-control form-1" id="email" placeholder="email" value={user.email} onChange={changeUser}/>
                
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control form-1" id="pass" placeholder="Password" value={user.pass} onChange={changeUser}/>
            
                </div>
                <div className="text-center">
                    <p>Do not have an account? Click <a onClick={() => signupNavigate("/signup")} href="#">here</a> to create one</p>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                    <button className="btn btn-primary" type="button" onClick={getUsers} data-bs-toggle="modal" data-bs-target="#exampleModal">Log in</button>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-body">
                            {message}
                        </div>
                        {error && <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )
}