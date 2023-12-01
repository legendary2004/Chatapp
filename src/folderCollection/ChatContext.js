import React from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = React.createContext();
export const ChatContextProvider = ({children}) => {
    const currentUser = React.useContext(AuthContext)
    const chatObj = {
        chatId: null,
        user: {}
    }

    function chatReducer(state, action) {
        if (action.type == 'changeUser') {
            return {
                user: action.info,
                chatId: currentUser.uid > action.info.id ? currentUser.uid + action.info.id : action.info.id + currentUser.uid
            }
        }
    }
    const [chatState, dispatchChatState] = React.useReducer(chatReducer, chatObj)

    return (
        <ChatContext.Provider value={{data: chatState, dispatchChatState}}>
            {children}
        </ChatContext.Provider>
    )
}