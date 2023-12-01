import React from "react";
import { AuthContext } from "./AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "./ChatContext";

export default function() {
    const [chats, setChats] = React.useState([])
    const currentUser = React.useContext(AuthContext)
    const currentUserChats = React.useContext(ChatContext)

    React.useEffect(() => {
        if (!currentUser) return;
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data())
            })

            return () => {
                unsub()
            }
        }
    }, [currentUser.uid])

    function getUserInfo(u) {
        currentUserChats.dispatchChatState({type: "changeUser", info: u})
    }

    return (
        <div>
            {Object.entries(chats)?.sort((a, b) => b.date - a.date).map(chat => {
                return (
                    <div className='userProfile' key={chat[0]} onClick={() => getUserInfo(chat[1].userInfo)} style={{marginTop: '5px'}}>
                        <div className='userChat'>
                            <img src={chat[1].userInfo.photoURL} className='profilePic' width='40px' height='40px'/>
                            <div>
                                <p className='profileName'>{chat[1].userInfo.name}</p>
                                <p className="lastMessage">{chat[1].lastMessage}</p>
                            </div>
                        </div>     
                    </div>
                )
            })}
        </div>
    )

}