import axios from "axios";

async function getRequest(path, params, token, schema) {
    return axios.get(path, params).then((response) => response.data);
}

export {getRequest}