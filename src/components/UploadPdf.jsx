import React, {useState, Fragment} from 'react'
import {Button} from 'antd'
import {PlusCircleOutlined, CloseCircleFilled} from '@ant-design/icons'
import styles from './UploadPdf.module.css'
import {callUploadPdf} from '../api/axios-api-calls'
import Upload from '../assets/upload.svg'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import {Document, Page, pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const UploadPdf = () => {
    const [fileArray, setFileArray] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [saveIsVisible, setSaveIsVisible] = useState(false)
    const [errorMessages, setErrorMessages] = useState('')
    const [successMessages, setSuccessMessages] = useState('')

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

    const handleUpload = async () => {
        try {
            setIsUploading(true)
            const response = await callUploadPdf(fileArray)
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
                            <Button
                                onClick={handleUpload}
                                type="primary"
                                size="large"
                                className={styles.save_button}
                            >
                                Send fax
                            </Button>
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
                                Add file
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
