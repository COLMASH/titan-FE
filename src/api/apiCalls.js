import {apiEndpoint} from './apiEndpoint'
import axios from 'axios'

export async function callUploadPdf(fileArray, phoneNumber) {
    const formData = new FormData()
    fileArray.forEach((file) => {
        return formData.append(file.name.substr(0, file.name.lastIndexOf('.')), file)
    })
    formData.append('phoneNumber', '+'.concat(phoneNumber))
    const headers = {
        headers: {'Content-Type': 'multipart/form-data'}
    }
    const response = await axios.post(`${apiEndpoint}/upload-pdf`, formData, headers)
    return response
}
