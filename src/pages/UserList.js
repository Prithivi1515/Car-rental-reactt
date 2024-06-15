import React, { useEffect, useState } from "react";
import axios from "axios";
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import DeleteIcon  from '@mui/icons-material/Delete';
import {showSnackbar} from "../actions/snackbarActions";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {logout} from "../reducers/userDetailsReducer";
import {getUserTypeName} from "../helpers/userTypes";

const UserList = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [users, setUsers] = useState([]);

    const getUsers = () => {
        axios.get(API_URL + '/user',{
            headers: token
        })
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error while fetching the list of users", false));
            })
    };

    const deleteUser = (id) => {
        axios.delete(API_URL + '/user/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("User successfully deleted", true));
                getUsers();
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified user was not found", false));
                } else if (error.response.status === 403) {
                    dispatch(showSnackbar("Default administrator account cannot be deleted", false));
                } else {
                    dispatch(showSnackbar("Error occurred while deleting the user", false));
                }
            })
    };

    const changeUserRole = (idUser, idRole) => {
        let role;
        if (idRole === 1) role = "user";
        else role = "admin";

        axios.put(API_URL + '/user/'+idUser+'/role/'+role, {}, {
            headers: token
        })
            .then(() => {
                dispatch(showSnackbar("User role changed successfully", true));

                if(idUser === userDetails.id){
                    dispatch(logout());
                } else {
                    getUsers();
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified user was not found", false));
                } else if (error.response.status === 403) {
                    dispatch(showSnackbar("Role of the default administrator account cannot be changed", false));
                } else {
                    dispatch(showSnackbar("Error occurred while changing user role", false));
                }
            })
    };

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        } else {
            getUsers();
        }
    },[userDetails.token]);

    return (
        <Container maxWidth="lg">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Typography variant='h4' align='center'>User list</Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/user/add')
                    }}
                >
                    Add user
                </Button>
                <Stack spacing={2}>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">Username</TableCell>
                                    <TableCell align="center">E-mail</TableCell>
                                    <TableCell align="center">Role</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users && users.length > 1 ? (
                                    users
                                        .filter(user => user.id !== 1)
                                        .map((filteredUser, index) => (
                                        <TableRow
                                            key={filteredUser.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{index+1}</TableCell>
                                            <TableCell align="center">{filteredUser.username}</TableCell>
                                            <TableCell align="center">{filteredUser.email}</TableCell>
                                            <TableCell align="center">{getUserTypeName(filteredUser.role.name)}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        changeUserRole(filteredUser.id, filteredUser.role.id);
                                                    }}
                                                >
                                                    <BookmarkIcon fontSize="small" />
                                                </Button>
                                                &nbsp;
                                                {userDetails.id !== filteredUser.id &&
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            deleteUser(filteredUser.id);
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </Button>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))) : (
                                    <TableRow><TableCell colSpan={8}><h2 align="center">No users to display</h2></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Box>
        </Container>
    );
};

export default UserList;