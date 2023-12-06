import axios from 'axios'



export const baseUrl = '/api'



export const postRequest = async (url, body) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const { data } = await axios.post(url, body, config, { withCredentials: true })
        return data
    } catch (error) {
        return { error: true, message: error.response.data.message }
    }
}

export const multiPartPostRequest = async (url, myForm) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }

    try {
        const { data } = await axios.post(url, myForm, config, { withCredentials: true })
        return data
    } catch (error) {
        return error
    }
}

export const getRequest = async (url, body) => {

    try {
        const { data } = await axios.get(url, { withCredentials: true })
        return data
    } catch (error) {
        return { error: true, message: error.response?.data.message }
    }
}

export const deleteRequest = async (url) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const { data } = await axios.delete(url, config, { withCredentials: true })
        return data
    } catch (error) {
        return { error: true, message: error.response.data.message }
    }
}