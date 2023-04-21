import React from 'react'
import {Button, InputNumber, Form} from 'antd'
import styles from './UploadForm.module.css'

const UploadForm = ({
    children,
    form,
    fieldsValidation,
    handleUpload,
    setErrorMessage,
    setPhoneNumber,
    phoneNumber
}) => {
    return (
        <Form form={form} layout="vertical" onFinish={handleUpload}>
            <div className={styles.phone_number_container}>
                <h3 style={{marginTop: '5px'}}>+</h3>
                <Form.Item
                    name="phoneNumber"
                    rules={fieldsValidation['phoneNumber']}
                    onChange={(e) => {
                        setErrorMessage()
                        setPhoneNumber('phoneNumber', e.target.value)
                    }}
                >
                    <InputNumber
                        className={styles.input_number}
                        placeholder="Enter phone number"
                        size="large"
                        value={phoneNumber}
                    />
                </Form.Item>
            </div>
            <Button htmlType="submit" type="primary" size="large" className={styles.save_button}>
                {children}
            </Button>
        </Form>
    )
}

export default UploadForm
