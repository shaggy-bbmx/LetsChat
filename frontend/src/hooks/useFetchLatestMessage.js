import { useEffect, useState, useContext } from "react"
import { getRequest, baseUrl } from "../Components/utils/services"
import { ChatContext } from "../Contexts/ChatContext"



export const useFetchLatestMessage = (chat) => {
    const [latestMessage, setLatestMessage] = useState(null)
    const { messages, notifications } = useContext(ChatContext)

    useEffect(() => {
        const getLatestMessage = async () => {
            const resp = await getRequest(`${baseUrl}/messages/${chat?._id}`)
            if (resp.error) return 

            if (resp?.length > 0) setLatestMessage(resp[resp.length - 1])
        }

        getLatestMessage()

    }, [chat, messages, notifications])

    return {
        latestMessage
    }
}