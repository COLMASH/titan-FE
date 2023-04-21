import {render, screen} from '@testing-library/react'
import FaxApp from '../FaxApp'

describe('FaxApp', () => {
    it('-1- should render a button with text "Add file"', () => {
        render(<FaxApp />)
        const addFile = screen.getByText(`Add file`)
        expect(addFile).toBeInTheDocument()
    })
})
