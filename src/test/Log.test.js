import {render , screen,cleanup} from '@testing-library/react'
import Login from '../pages/Login'

test('should render todo component', () => {
    render(<Login />);
    const loginElement = screen.getByTestId('test-1');
    expect(todoElement).toBeInTheDocument();
})