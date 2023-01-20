import React, {useState, Fragment} from 'react'
import {Button, InputNumber, Form} from 'antd'
import {PlusCircleOutlined, CloseCircleFilled} from '@ant-design/icons'
import styles from './UploadPdf.module.css'
import {callUploadPdf} from '../api/axios-api-calls'
import Upload from '../assets/upload.svg'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import {Document, Page, pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const fieldsValidation = {
    phoneNumber: [
        {required: true, message: 'Please enter a phone number.'},
        {
            validator: async (_, value) => {
                const stringValue = value && value.toString()
                if (stringValue && stringValue.length !== 11) {
                    throw new Error('Please enter a valid phone number.')
                }
            },
            message: 'Please enter a valid phone number.'
        }
    ]
}

const UploadPdf = () => {
    const [faxForm] = Form.useForm()
    const [fileArray, setFileArray] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [saveIsVisible, setSaveIsVisible] = useState(false)
    const [errorMessages, setErrorMessages] = useState('')
    const [successMessages, setSuccessMessages] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const handleChange = async (e) => {
        setErrorMessages('')
        setSuccessMessages('')
        if (e.target.files[0]) {
            let fileObj = e.target.files[0]
            let extension = fileObj.name.split('.').pop().toLowerCase()
            if (extension !== 'pdf') {
                setErrorMessages('File extension is not PDF. Please try another file.')
                e.target.value = ''
            } else if (fileObj) {
                const fileArrayData = [fileObj]
                setFileArray(fileArrayData)
                setSaveIsVisible(true)
                setErrorMessages('')
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
                setSuccessMessages('Fax has been sent successfully!')
            }
        } catch (error) {
            setIsUploading(false)
            setErrorMessages('Something went wrong, please try again')
            console.error(error)
        }
    }

    const handleDelete = () => {
        setFileArray([])
        setSaveIsVisible(false)
    }

    return (
        <div className={styles.mainContainer}>
            {!isUploading ? (
                <>
                    <div className={styles.container}>
                        {errorMessages && (
                            <div className={styles.text_error}>
                                <p>{errorMessages}</p>
                            </div>
                        )}
                        {successMessages && (
                            <div className={styles.text_green}>
                                <p>{successMessages}</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.container}>
                        {saveIsVisible ? (
                            <Form form={faxForm} layout="vertical" onFinish={handleUpload}>
                                <div className={styles.phoneNumberContainer}>
                                    <h3 style={{marginTop: '5px'}}>+</h3>
                                    <Form.Item
                                        name="phoneNumber"
                                        rules={fieldsValidation['phoneNumber']}
                                        onChange={(e) => {
                                            setErrorMessages()
                                            setPhoneNumber('phoneNumber', e.target.value)
                                        }}
                                    >
                                        <InputNumber
                                            style={{
                                                width: '100%',
                                                height: '40px'
                                            }}
                                            placeholder="Enter phone number"
                                            size="large"
                                            value={phoneNumber}
                                        />
                                    </Form.Item>
                                </div>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    size="large"
                                    className={styles.save_button}
                                >
                                    Send fax
                                </Button>
                            </Form>
                        ) : null}
                        <div className={styles.images_container}>
                            <input
                                type="file"
                                id="files"
                                onChange={handleChange}
                                style={{display: 'none'}}
                            />
                            {fileArray.map((file, index) => {
                                const fileSubstr = file.name
                                const pdfExtension = fileSubstr.substring(fileSubstr.length - 3)
                                if (pdfExtension === 'pdf') {
                                    return (
                                        <Fragment key={index}>
                                            <div>
                                                <div className={styles.close_pdf_container}>
                                                    <CloseCircleFilled
                                                        onClick={() => handleDelete()}
                                                        className={styles.close_circle_icon}
                                                    />
                                                </div>
                                                <Document file={file}>
                                                    <Page
                                                        pageNumber={1}
                                                        height={400}
                                                        width={200}
                                                        className={styles.image_pdf}
                                                    />
                                                </Document>
                                            </div>
                                        </Fragment>
                                    )
                                } else {
                                    return null
                                }
                            })}
                            <label htmlFor="files" className={styles.button}>
                                <PlusCircleOutlined className={styles.select} />
                                {saveIsVisible ? 'Change file' : 'Add file'}
                            </label>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.upload_message}>
                    <img alt="" src={Upload} />
                    <h3 className={styles.uploading}>Sending fax...</h3>
                </div>
            )}
        </div>
    )
}

export default UploadPdf
