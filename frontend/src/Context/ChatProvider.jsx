import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userinfo);

        if (!userinfo) {
            navigate('/')
        }
    }, [navigate])
    return (
        <chatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat ,chats, setChats, notification, setNotification}}>
            {children}
        </chatContext.Provider>
    )
}

export const useChatState = () => {
    return useContext(chatContext);
}
export default ChatProvider; 