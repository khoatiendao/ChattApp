import { useEffect, useState } from "react";
import { baseUrl, baseUrlChat, getRequest } from "../utils/service";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null)
    const [error, setError] = useState(null)

    const recipientId = chat?.members?.find((id) => id !== user?.user._id)

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) {
                return null
            }
            
            const response = await getRequest(`${baseUrl}/find/${recipientId}`);
            
            if (response.error) {
                return setError(error)
            }
            
            setRecipientUser(response)
        }
        
        getUser();
    }, [recipientId]);
    
    return { recipientUser }
}