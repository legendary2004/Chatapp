import './App.css';
import * as firebase from "./firebase";
import { collection, doc, getDocs, getFirestore, query, where, getDoc, setDoc, updateDoc, serverTimestamp} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { AuthContext } from './folderCollection/AuthContext';
import UserChats from './folderCollection/userChats';
import { ChatContext } from './folderCollection/ChatContext';
import MsgComponent from './folderCollection/MsgComponent';


function App() {
  const navigate = useNavigate();
  let [input, setInput] = React.useState("");
  let [allUsers, setAllUsers] = React.useState([]);
  let [foundUsers, setFoundUsers] = React.useState([]);
  const [profile, setProfile] = React.useState(null);
  const [searchedUser, setSearchedUser] = React.useState(null);
  let signedUser = React.useContext(AuthContext);
  
  function loginNavigate(path) {
    navigate(path, { replace: true });
  }

  React.useEffect(() => {
    if (signedUser) {
      setProfile(
        <div className='userProfile'>
          <div className='userChat'>
            <img src={signedUser.photoURL} className='profilePic' width='40px' height='40px'/>
            <p className='profileName'>{signedUser.displayName}</p>
          </div> 
        </div>
      )
    }
  }, [signedUser])

  React.useEffect(() => {
    if (allUsers.length == 0) {
      getDocs(collection(db, "users")).then(res => {
        res.docs.map(userName => {
          {
            if (signedUser && userName.data().name !== signedUser.displayName) {
              allUsers.push({id: userName.data().id, name: userName.data().name})
            }
          }
        })
      })
    }
    if (input.length > 2) setFoundUsers(allUsers.filter(user => user.name?.toLowerCase().includes(input.toLowerCase())))
  }, [input])

  async function logOut() {
    navigate("/login", {replace: true})
    await signOut(auth)
  }

  async function searchUser(e) {
    if (e.code === 'Enter') {
      const q = query(collection(db, "users"), where("name", "==", input));
      const doc = await getDocs(q)
      if (doc.docs.length > 0) {
        doc.docs.map(user => {
          setSearchedUser(user.data())
        })
      }
      else {
        alert("No user was found")
      }
    }
  }

  async function getUser() {
    const combinedId = signedUser.uid > searchedUser.id ? signedUser.uid + searchedUser.id : searchedUser.id + signedUser.uid
    const res = await getDoc(doc(db, "chats", combinedId))

    if (!res.exists()) {
      await setDoc(doc(db, "chats", combinedId), {messages: []});
      await updateDoc(doc(db, "userChats", signedUser.uid), {
        [combinedId+".userInfo"]: {
          id: searchedUser.id,
          name: searchedUser.name,
          photoURL: searchedUser.photoURL
        },
        [combinedId+".date"]: serverTimestamp()
      })
      await updateDoc(doc(db, "userChats", searchedUser.id), {
        [combinedId+".userInfo"]: {
          id: signedUser.uid,
          name: signedUser.displayName,
          photoURL: signedUser.photoURL
        },
        [combinedId+".date"]: serverTimestamp()
      })
    }
  }


  return (
    <div className="App row">
      <div className='col-4 div-1'>
        <div className='div-2'>
          <nav className="navbar bg-body-tertiary col-3 nav-1">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1 ms-3">Chat Application</span>
            </div>
          </nav>
            <div>{profile}</div>
          {signedUser ? 
            <button type="button" className="btn col-3 btn-1" onClick={logOut}>Log Out</button> :
            <button type="button" className="btn col-3 btn-1" onClick={() => loginNavigate("/login")}>Log in</button>
          }
        </div>
        <div className='div-3'>
          <div className='div-3_1'>
            <input className="form-control form-1 pt-3" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." onChange={(e) => setInput(e.target.value)} onKeyDown={searchUser} value={input}/>
            {input.length > 2 && <datalist id="datalistOptions" >
              {foundUsers.map((user, index) => {
                return <option value={user.name} key={index} id={user.id}/>
              })}
            </datalist>}
            {searchedUser && <div className='userProfile'>
              <div className='userChat' onClick={getUser}>
                <img src={searchedUser.photoURL} className='profilePic' width='40px' height='40px'/>
                <p className='profileName'>{searchedUser.name}</p>
              </div> 
            </div>}
            {signedUser && <UserChats />}
          </div>
        </div>
      </div>
      <MsgComponent />
    </div>
  );
}

export default App;
