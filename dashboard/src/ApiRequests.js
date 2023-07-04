import axios from 'axios';

const URL = process.env.REACT_APP_SERVER_URI;

export function PostRequest(endpoint, data) {
    console.log(URL+endpoint)
    const response = axios
        .post(URL+endpoint, data)
    return response
}