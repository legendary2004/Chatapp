import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, storage} from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable} from "firebase/storage";

export default function() {
    let navigate = useNavigate();
    let [user, setUser] = React.useState({name: "", email: "", pass: "", pass2: "", profile: ""});
    let [message, setMessage] = React.useState("");
    let [error, setError] = React.useState("");
    function setInto(e) {
        let id = e.target.id;
        let value = e.target.type == 'file' ? e.target.files[0] : e.target.value;
        setUser(prevState => {
            return {
                ...prevState,
                [id]: value
            }
        })
    }

    async function submitInfo(e) {
        e.preventDefault();
        const q = query(collection(db, "users"), where("name", "==", user.name))
        const res = await getDocs(q)
            
        try {
            if (user.name.length < 5) setError("auth/weak-username")
            else if (res.docs.length > 0) setError("auth/username-already-in-use")
            else if (user.pass !== user.pass2) setError("auth/invalid-password")
            else {
                setError('')
                await createUserWithEmailAndPassword(auth, user.email, user.pass)
                .then(async res => {
                    const image = ref(storage, res.user.uid + ".png");
                    user.profile && await uploadBytes(image, user.profile);
                    const imageUrl = user.profile ? await getDownloadURL(image) : "https://firebasestorage.googleapis.com/v0/b/chat-54b49.appspot.com/o/profile.png?alt=media&token=427576a9-800e-4372-bf0f-0431cfa9289c";
                    updateProfile(res.user, {
                        displayName: user.name,
                        photoURL: imageUrl
                    })
                    setDoc(doc(db, "users", res.user.uid), {
                        id: res.user.uid,
                        name: user.name,
                        email: res.user.email,
                        photoURL: imageUrl
                    })
                    setDoc(doc(db, "userChats", res.user.uid), {})
                })
            }
        } 
        catch (err) {
            setError(err.code)
        }      
    }
    
    React.useEffect(() => {
        if (error == 'auth/email-already-in-use') setMessage("This email is already in use")
        if (error == 'auth/invalid-email') setMessage("Not a valid email")
        if (error == 'auth/weak-password') setMessage("Password must contain at least 6 letters")
        if (error == 'auth/missing-password') setMessage("Password cannot be empty")
        if (error == "auth/weak-username") setMessage("username should contain at least 5 characters")
        if (error == "auth/invalid-password") setMessage("Passwords do not match")
        if (error == "auth/username-already-in-use") setMessage("This username is already in use.")
        if (!error) setMessage(
            <div>Account created. Click <a href="#" onClick={() => signupNavigate("/")} data-bs-dismiss="modal">here</a> to continue chatting</div>
        )
    }, [error])
    
    function signupNavigate(path) {
        navigate(path, {replace: true})
    }
    return (
        <div className="body">
            <div className="container form ">
                <form>
                    <input type="text" className="form-control form-1 mb-3" id="name" placeholder="display name" value={user.name} onChange={setInto} required/>
                
                    <input type="email" className="form-control form-1 mb-3" id="email" placeholder="email" value={user.email} onChange={setInto} required/>                    
                
                    <input type="password" className="form-control form-1 mb-3" id="pass" placeholder="Password" value={user.pass} onChange={setInto} required/>        
                
                    <input type="password" className="form-control form-1 mb-3" id="pass2" placeholder="Repeat password" value={user.pass2} onChange={setInto} required/>

                    <input className="form-control mb-3 form-3" type="file" id="profile" accept="image/*" onChange={setInto}></input>

                    <button className="btn btn-primary ms-auto mb-2" type="submit" onClick={submitInfo} data-bs-toggle="modal" data-bs-target="#exampleModal">Create new account</button>
                </form>
                <div className="text-center">
                    <p>Already have an account? Click <a onClick={() => signupNavigate("/login")} href="#">here</a> to log in</p>
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