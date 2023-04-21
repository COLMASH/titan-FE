import React from 'react'
import styles from './LoadingImage.module.css'
import Upload from '../../assets/upload.svg'

const LoadingImage = ({children}) => {
    return (
        <div className={styles.upload_message}>
            <img alt="Loading..." src={Upload} />
            <h3 className={styles.uploading}>{children}</h3>
        </div>
    )
}

export default LoadingImage
