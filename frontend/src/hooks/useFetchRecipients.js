import { useEffect, useState } from "react"
import { getRequest, baseUrl } from "../Components/utils/services"

export const useFetchRecipients = (chat, user) => {

    const [recipientUser, setRecipientUser] = useState(null)

    const [error, setError] = useState(null)

    const recipientId = chat?.members.find(id => id !== user._id)


    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return

            const resp = await getRequest(`${baseUrl}/users/find/${recipientId}`)

            if (resp.error) return setError(resp)

            setRecipientUser(resp)
        }

        getUser()

    }, [recipientId])

    return {
        recipientUser,
        error
    }
}

