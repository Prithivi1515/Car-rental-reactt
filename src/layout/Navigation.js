import { Link, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../reducers/userDetailsReducer";
import AdminMenuList from "../components/AdminMenuList";
import { ForkLeft } from '@mui/icons-material';

const Navigation = () => {
    let navigate = useNavigate();
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();

    const logOut = () => {
        dispatch(logout());
        navigate('/', { replace: true });
    };

    return(
        <>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'flex-start' ,"& > *": { margin: 0 ,padding: 0} }}>
                <Button
                    component={Link}
                    sx={{ my: 2, color: '#212F3D',fontWeight: 600, display: 'block' }}
                    to="home"
                >
                    Home
                </Button>
            </Box>

            {userDetails.roles.includes("ROLE_ADMIN") && (
                <>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                         <AdminMenuList />
                    </Box>
                </>
            )}

            {(userDetails.roles.includes('ROLE_USER') || userDetails.roles.includes('ROLE_ADMIN')) ? (
                <>
                      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>   
                      <Button
                            component={Link}
                            sx={{ my: 2, color: '#212F3D', display: 'block' ,fontWeight: 600}}
                            to="my-rentals"
                        >
                            My rentals
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                         <Button
                            component={Link}
                            sx={{ my: 2, color: '#212F3D', display: 'block' ,fontWeight: 600}}
                            to="profile"
                        >
                            My profile
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            sx={{ my: 2, color: '#212F3D', display: 'block' ,fontWeight: 600}}
                            onClick={logOut}
                        >
                            Logout
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'flex-start' ,"& > *": { margin: 0 ,padding: 0} }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: '#212F3D', display: 'block',fontWeight: 600 }}
                            to="login"
                        >
                            Login
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'flex-start',"& > *": { margin: 0 }  }}>
                        <Button
                            component={Link}
                            sx={{ my: 2, color: '#212F3D', display: 'block',fontWeight: 600 }}
                            to="register"
                        >
                            Register
                        </Button>
                    </Box>
                </>
            )}
        </>
    )
};

export default Navigation;