import React from 'react'
import {CloseCircleFilled, PlusCircleOutlined} from '@ant-design/icons'
import {Document, Page, pdfjs} from 'react-pdf'
import styles from './PdfSelector.module.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PdfSelector({fileArray, handleDelete, handleChange, saveIsVisible}) {
    return (
        <div className={styles.images_container}>
            <input
                alt="add pdf"
                type="file"
                id="files"
                onChange={handleChange}
                style={{display: 'none'}}
            />
            {fileArray.map((file, index) => {
                const fileName = file.name
                const pdfExtension = fileName.substring(fileName.length - 3)
                if (pdfExtension === 'pdf') {
                    return (
                        <div key={index}>
                            <div className={styles.close_pdf_container}>
                                <CloseCircleFilled
                                    aria-label="delete document"
                                    onClick={handleDelete}
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
    )
}

export default PdfSelector
