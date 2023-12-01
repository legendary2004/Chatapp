import React from "react"
import { ChatContext } from "./ChatContext"
import { FaFileUpload } from "react-icons/fa"
import { IoIosSend } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { AuthContext } from "./AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SingleMsg from "./SingleMsg";


export default function() {
    const currentUser = React.useContext(AuthContext)
    const currentUserChats = React.useContext(ChatContext);
    const [allMessages, setAllMessages] = React.useState([]);
    const [text, setText] = React.useState("");
    const [file, setFile] = React.useState("");
    React.useEffect(() => {
        if (currentUserChats.data.chatId) {
            onSnapshot(doc(db, "chats", currentUserChats.data.chatId), (docu) => {
                setAllMessages(docu.data().messages)
            })
        }
    }, [currentUserChats])

    async function handleMessageSelect() {
        if (text || file) {
            async function updateToDoc(id, message, senderId, senderPhotoURL, date) {
                await updateDoc(doc(db, "chats", currentUserChats.data.chatId), {
                    messages: arrayUnion({
                        id,
                        message, 
                        senderId,
                        senderPhotoURL,
                        date
                    })
                })
            }
            if (file && text) {
                const image = ref(storage, uuid());
                await uploadBytes(image, file);
                const imgUrl = await getDownloadURL(image);
                await updateToDoc(uuid(), {imgUrl, text}, currentUser.uid, currentUser.photoURL, Timestamp.now())
            }
            else if (file) {
                const image = ref(storage, uuid());
                await uploadBytes(image, file);
                const imgUrl = await getDownloadURL(image);
                await updateToDoc(uuid(), {imgUrl}, currentUser.uid, currentUser.photoURL, Timestamp.now())
            }
            else {
                await updateToDoc(uuid(), {text}, currentUser.uid, currentUser.photoURL, Timestamp.now())
            }
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [currentUserChats.data.chatId + ".date"]: serverTimestamp(),
                [currentUserChats.data.chatId + ".lastMessage"]: text
            })
            await updateDoc(doc(db, "userChats", currentUserChats.data.user.id), {
                [currentUserChats.data.chatId + ".date"]: serverTimestamp(),
                [currentUserChats.data.chatId + ".lastMessage"]: text
            })
            setFile("")
            setText("")
        }
    }
    return (
        <div className='col-8 div-4'>
            <div className='div-2' style={{background: "#1b93f5"}}>
                <nav className="navbar bg-body-tertiary col-4 nav-1">
                    <div className="container-fluid">
                        {currentUserChats.data.user?.name
                         && <div><img src={currentUserChats.data.user?.photoURL} width='40px' height='40px' className="profilePic"/><span className="navbar-brand mb-0 h1 ms-2">{currentUserChats.data.user?.name}</span></div>}
                    </div>
                </nav>
            </div>
            <div className="div-5">
                <div className="div-5_1">
                {allMessages.map(message => {
                    return (
                        <SingleMsg id={message.id} text={message.message.text} imgUrl={message.message.imgUrl} userPhotoURL={message.senderPhotoURL} />
                    )
                })}
                </div>
            </div>
            <div className="div-6">
                <div className="input-group input-group-1">
                    <label for="formFileMultiple" className="form-label">
                        <FaFileUpload className="btn btn-outline-secondary fa-icon"/>
                    </label>
                    <input className="form-control" type="file" id="formFileMultiple" multiple style={{display: "none"}} onChange={(e) => setFile(e.target.files[0])}/>
            
                    <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)" placeholder="type message..." onChange={(e) => setText(e.target.value)} value={text}/>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleMessageSelect}><IoIosSend style={{fontSize: '30px'}}/></button>
                </div>
            </div>
        </div>
    )
}