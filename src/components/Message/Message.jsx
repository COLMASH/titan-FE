import React from 'react'
import styles from './Message.module.css'

const Message = ({errorMessage, successMessage}) => {
    return (
        <div className={styles.container}>
            {errorMessage && (
                <div className={styles.text_error}>
                    <p>{errorMessage}</p>
                </div>
            )}
            {successMessage && (
                <div className={styles.text_green}>
                    <p>{successMessage}</p>
                </div>
            )}
        </div>
    )
}

export default Message
