import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrlMessage, getRequest } from "../utils/service";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [ latestMessage, setLatestMessage ] = useState(null);


    useEffect(() => {
        const getMessage = async () => {
            const response = await getRequest(`${baseUrlMessage}/${chat?._id}`);

            if (response.error) {
                return console.log("Error getting messages...", error)
            }

            const lastMessage = response.messages[response.messages.length - 1];

            setLatestMessage(lastMessage);
        };

        getMessage();
    }, [newMessage, notifications, chat])

    return { latestMessage }
}