import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, baseUrlChat, postRequest, baseUrl, baseUrlMessage } from "../utils/service";
import {io} from "socket.io-client";
// import { useFetchRecipientUser } from "../hooks/useFetchRecipient";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notifications, setNotifcations] = useState([])
    const [allUsers, setAllUsers] = useState([])

    console.log("notification", notifications)

    useEffect(() => {
        const newSocket = io("http://localhost:3001", {
            transports: ["websocket"]
        })

        newSocket.on('connect', () => {
            console.log("Connect to server")
        })

        newSocket.on('disconnect', () => {
            console.log("Disconnect from server")
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect();
        }
    }, [user])


    // Add user online
    useEffect(() => {
        if(socket === null) return 
        socket.emit("addNewUser", user?.user._id)
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res)
        });

        return () => {
            socket.off("getOnlineUsers")
        }
    }, [socket])

    // send Message
    useEffect(() => {
        if(socket === null) return

        const recipientId = currentChat?.members?.find((id) => id !== user?.user._id)

        socket.emit("sendMessage", { ...newMessage, recipientId })
    }, [newMessage])

    // recieve Message and Notification
    useEffect(() => {
        if(socket === null) return

        socket.on("getMessage", (res) => {
            if(currentChat?._id !== res.chatId) return

            setMessages((prev) => [...prev, res])
        })

        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId)

            if(isChatOpen) {
                setNotifcations(prev => [{...res, isRead: true}, ...prev])
            } else {
                setNotifcations(prev => [res, ...prev])
            }
        })

        return () => {
            socket.off("getMessage")
            socket.off("getNotification")
        } 
    }, [socket, currentChat])

    useEffect(() => {
        const getUser = async () => {
            const response = await getRequest(`${baseUrl}/`)

            if (response.error) {
                return console.log("Error fetching users", response)
            }

            const pChats = response.user.filter((u) => {
                let isChatCreated = false;
                if (user?.user._id === u._id) {
                    return false;
                }

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat?.members[0] === u._id || chat.members[1] === u._id
                    })
                }

                return !isChatCreated;
            });

            setPotentialChats(pChats);
            setAllUsers(response.user)
        }

        getUser()
    }, [userChats])

    useEffect(() => {
        const getUserChats = async () => {
            if (user?.user._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null)
                const response = await getRequest(`${baseUrlChat}/${user?.user._id}`);

                setIsUserChatsLoading(false)

                if (response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response);
            }
        }

        getUserChats();
    }, [user, notifications])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrlChat}/`, JSON.stringify({ firstId, secondId }))
        if (response.error) {
            return console.log("Error creating chat", response);
        }
        setUserChats((prev) => [...prev, response.response]);
    }, [])

    useEffect(() => {
        const getMessages = async() => {
            setIsMessagesLoading(true)
            setMessagesError(null)

            const response = await getRequest(`${baseUrlMessage}/${currentChat?._id}`)

            setIsMessagesLoading(false)

            if(response.error) {
                return setMessagesError(response)
            }

            setMessages(response.messages);
            // console.log(response.messages)

        };

        getMessages()
    }, [currentChat])

    const sendTextMessage = useCallback( async(textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage) {
            return console.log("You must type something...")
        }

        const response = await postRequest(`${baseUrlMessage}/`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender.user._id,
            text: textMessage
        }))

        if(response.error) {
            return setSendTextMessageError(response)
        }

        setNewMessage(response.response);
        setMessages((prev) => [...prev, response.response])
        setTextMessage("")
    }, [])

    const markAllNotificationAsRead = useCallback((notifications) => {
        const modifiedNotifications = notifications.map((n) => {
            return {
                ...n,
                isRead: true
            }
        })

        setNotifcations(modifiedNotifications)
    }, [])

    const markNotificationsAsRead = useCallback((n, userChats, user, notifications) => {

        //find chat to open

        const desiredChat = userChats.find(chat => {
            const chatMembers = [user?.user._id, n.senderId]
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member)
            });

            return isDesiredChat;
        })

        // mark notification as read
        const modifiedNotificationAsRead = notifications.map(el => {
            if(n.senderId === el.senderId) {
                return {...n, isRead: true}
            } else {
                return el;
            }
        })

        updateCurrentChat(desiredChat)
        setNotifcations(modifiedNotificationAsRead)
    },[])

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
        // mark notification as read
        const mNotifications = notifications.map(el => {
            let notification;

            thisUserNotifications.forEach(n => {
                if(n.senderId === el.senderId) {
                    notification = {...n, isRead: true}
                } else {
                    notification = el
                }
            })

            return notification
        })

        setNotifcations(mNotifications);
    }, [])

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            currentChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
            onlineUsers,
            notifications,
            allUsers,
            markAllNotificationAsRead,
            markNotificationsAsRead,
            markThisUserNotificationsAsRead,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

