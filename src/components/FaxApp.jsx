import React, {useState} from 'react'
import {Form} from 'antd'
import styles from './FaxApp.module.css'
import {callUploadPdf} from '../api/apiCalls'
import Message from './Message/Message'
import UploadForm from './UploadForm/UploadForm'
import PdfSelector from './PdfSelector/PdfSelector'
import LoadingImage from './LoadingImage/LoadingImage'
import fieldsValidation from '../utils/fieldsValidation'

const FaxApp = () => {
    const [faxForm] = Form.useForm()
    const [fileArray, setFileArray] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [saveIsVisible, setSaveIsVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const handleChange = async (e) => {
        setErrorMessage('')
        setSuccessMessage('')
        if (e.target.files[0]) {
            let file = e.target.files[0]
            let extension = file.name.split('.').pop().toLowerCase()
            if (extension !== 'pdf') {
                setErrorMessage('File extension is not PDF. Please try another file.')
                e.target.value = ''
            } else if (file) {
                const fileArrayData = [file]
                setFileArray(fileArrayData)
                setSaveIsVisible(true)
                setErrorMessage('')
                e.target.value = ''
            }
        }
    }

    const handleUpload = async (values) => {
        try {
            setIsUploading(true)
            const response = await callUploadPdf(fileArray, values.phoneNumber)
            if (response.status === 200) {
                setIsUploading(false)
                setFileArray([])
                setSaveIsVisible(false)
                setSuccessMessage('Fax has been sent successfully!')
            }
        } catch (error) {
            setIsUploading(false)
            setErrorMessage('Something went wrong, please try again')
        }
    }

    const handleDelete = () => {
        setErrorMessage('')
        setFileArray([])
        setSaveIsVisible(false)
    }

    return (
        <div className={styles.main_container}>
            {!isUploading ? (
                <>
                    <Message errorMessage={errorMessage} successMessage={successMessage}></Message>
                    <div className={styles.container}>
                        {saveIsVisible ? (
                            <UploadForm
                                form={faxForm}
                                fieldsValidation={fieldsValidation}
                                handleUpload={handleUpload}
                                setErrorMessage={setErrorMessage}
                                setPhoneNumber={setPhoneNumber}
                                phoneNumber={phoneNumber}
                            >
                                Send fax
                            </UploadForm>
                        ) : null}
                        <PdfSelector
                            fileArray={fileArray}
                            handleDelete={handleDelete}
                            handleChange={handleChange}
                            saveIsVisible={saveIsVisible}
                        />
                    </div>
                </>
            ) : (
                <LoadingImage>Sending fax...</LoadingImage>
            )}
        </div>
    )
}

export default FaxApp
