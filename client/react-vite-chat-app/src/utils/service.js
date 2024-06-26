export const baseUrl = "http://localhost:3000/api/v1/user"
export const baseUrlChat = "http://localhost:3000/api/v1/chat"
export const baseUrlMessage = "http://localhost:3000/api/v1/message"


export const postRequest = async(url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body
    })

    const data = await response.json();
    if(!response.ok) {
        let message
        if(data?.message) {
            message = data.message
        } else {
            message = data;
        }

        return {error: true, message}
    }
    return data;
};

export const getRequest = async(url) => {
    const response = await fetch(url);

    const data = await response.json();

    if(!response.ok) {
        let message = "An error occured";
        if(data?.message) {
            message = data.message;
        }

        return { error: true, message }
    }

    return data;
}
