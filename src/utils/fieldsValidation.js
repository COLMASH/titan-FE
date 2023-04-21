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

export default fieldsValidation
