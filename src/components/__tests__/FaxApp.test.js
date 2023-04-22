import {render, screen, fireEvent} from '@testing-library/react'
import axios from 'axios'
import FaxApp from '../FaxApp'

jest.mock('axios')
jest.mock('react-pdf', () => ({
    pdfjs: {GlobalWorkerOptions: {workerSrc: 'abc'}},
    Document: ({onLoadSuccess = (pdf = {numPages: 1}) => pdf.numPages}) => {
        return <div>{onLoadSuccess({numPages: 1})}</div>
    },
    Outline: null,
    Page: () => <div>def</div>
}))

describe('FaxApp', () => {
    beforeEach(() => {
        render(<FaxApp />)
        jest.clearAllMocks()
    })
    it('-1- should render a button with text "Add file"', async () => {
        const addFile = screen.getByText(`Add file`)
        expect(addFile).toBeInTheDocument()
    })
    it('-2- should select a PDF file when "Add file" button is clicked', async () => {
        const file = new File(['(⌐□_□)'], 'example.pdf', {type: 'application/pdf'})
        const input = screen.getByAltText('add pdf')
        fireEvent.change(input, {target: {files: [file]}})
        const changeFileButton = await screen.findByText(`Change file`)
        expect(changeFileButton).toBeInTheDocument()
    })
    it('-3- should render an error message if selected file is not PDF', async () => {
        const file = new File(['(⌐□_□)'], 'example.txt', {type: 'application/txt'})
        const input = screen.getByAltText('add pdf')
        fireEvent.change(input, {target: {files: [file]}})
        const errorMessage = await screen.findByText(
            `File extension is not PDF. Please try another file.`
        )
        expect(errorMessage).toBeInTheDocument()
    })
    it('-4- should upload a PDF file when "Send fax" button is clicked', async () => {
        axios.post.mockResolvedValueOnce({
            status: 200
        })
        const file = new File(['(⌐□_□)'], 'example.pdf', {type: 'application/pdf'})
        const input = screen.getByAltText('add pdf')
        fireEvent.change(input, {target: {files: [file]}})
        const sendFaxButton = await screen.findByText(`Send fax`)
        const phoneInput = await screen.findByPlaceholderText(`Enter phone number`)
        fireEvent.change(phoneInput, {target: {value: 12345678901}})
        fireEvent.click(sendFaxButton)
        const successMessage = await screen.findByText(`Fax has been sent successfully!`)
        expect(successMessage).toBeInTheDocument()
    })
    it('-5- should render a Loading image when "Send fax" button is clicked', async () => {
        axios.post.mockResolvedValueOnce({
            status: 300
        })
        const file = new File(['(⌐□_□)'], 'example.pdf', {type: 'application/pdf'})
        const input = screen.getByAltText('add pdf')
        fireEvent.change(input, {target: {files: [file]}})
        const sendFaxButton = await screen.findByText(`Send fax`)
        const phoneInput = await screen.findByPlaceholderText(`Enter phone number`)
        fireEvent.change(phoneInput, {target: {value: 12345678901}})
        fireEvent.click(sendFaxButton)
        const loadingMessage = await screen.findByText(`Sending fax...`)
        expect(loadingMessage).toBeInTheDocument()
    })
    it('-6- should delete PDF document when close circle button is clicked', async () => {
        const file = new File(['(⌐□_□)'], 'example.pdf', {type: 'application/pdf'})
        const input = screen.getByAltText('add pdf')
        fireEvent.change(input, {target: {files: [file]}})
        const deleteDocumentButton = await screen.findByRole('img', {name: 'delete document'})
        fireEvent.click(deleteDocumentButton)
        const addFile = await screen.findByText(`Add file`)
        expect(deleteDocumentButton).not.toBeInTheDocument()
        expect(addFile).toBeInTheDocument()
    })
    it('-7- should render an error message if backend call is rejected', async () => {
        axios.post.mockRejectedValueOnce(new Error('Error'))
        const file = new File(['(⌐□_□)'], 'example.pdf', {type: 'application/pdf'})
        const input = screen.getByAltText('add pdf')
        fireEvent.change(input, {target: {files: [file]}})
        const sendFaxButton = await screen.findByText(`Send fax`)
        const phoneInput = await screen.findByPlaceholderText(`Enter phone number`)
        fireEvent.change(phoneInput, {target: {value: 12345678901}})
        fireEvent.click(sendFaxButton)
        const errorMessage = await screen.findByText(`Something went wrong, please try again`)
        expect(errorMessage).toBeInTheDocument()
    })
})
