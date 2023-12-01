import React from "react"
import "../App.css"
import { AuthContext } from "./AuthContext"
import { ChatContext } from "./ChatContext";

export default function(message) {
    const currentUser = React.useContext(AuthContext);

    const style = {
        justifyContent: currentUser.photoURL === message.userPhotoURL ? "flex-end" : "flex-start",
        marginTop: '5px',
        display: 'flex',
        alignItems: 'flex-start',
    }
    const style1 = {
        padding: '5px',
        border: '1px solid lightblue',
        background: 'lightblue',
        borderRadius: '20px',
        borderTopLeftRadius: currentUser.photoURL === message.userPhotoURL ? '20px' : '0px',
        borderTopRightRadius: currentUser.photoURL === message.userPhotoURL ? '0px' : '20px',
        maxWidth: '50%',
    }
    
    return (
        <div key={message.id} style={style}>
            {currentUser.photoURL !== message.userPhotoURL && <img src={message.userPhotoURL} className="profilePic" width="40px" height="40px" style={{marginRight: '5px'}}/>}
            <div style={style1}>
                {message.text && <p className="profileName" >{message.text}</p>}
                {message.imgUrl && <img src={message.imgUrl} width='200px' height='200px' style={{margin: '5px'}}/>}  
            </div>
            {currentUser.photoURL === message.userPhotoURL && <img src={message.userPhotoURL} className="profilePic" width="40px" height="40px" style={{marginRight: '15px'}}/>}
        </div>
    )
}