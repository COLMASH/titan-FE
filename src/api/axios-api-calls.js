import {apiEndpoint} from './api-endpoint'
import axios from 'axios'

export async function callUploadPdf(fileArray) {
    const formData = new FormData()
    fileArray.forEach((v, i) => {
        return formData.append(v.name.substr(0, v.name.lastIndexOf('.')), v)
    })
    const headers = {
        headers: {'Content-Type': 'multipart/form-data'}
    }
    const res = await axios.post(`${apiEndpoint}/upload-pdf`, formData, headers)
    return res
}
