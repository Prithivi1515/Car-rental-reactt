import { Outlet } from "react-router-dom";
import Header from "./Header";
import { AppBar, Container } from '@mui/material';

const Layout = () => {
    return (
        <>
            <AppBar position='static' >
                <Container sx = {{bgcolor:'#F7F9F9'}} maxWidth="xl">
                    <Header />
                </Container>
            </AppBar>
            <Outlet />
        </>
    )
};

export default Layout;