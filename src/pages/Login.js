import React, { useEffect } from 'react';
import { Typography, TextField, Box, Button, Stack, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/userDetailsReducer';
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";
import Drawer from '@mui/material/Drawer/Drawer';

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username field cannot be empty"),
    password: Yup.string()
        .required("Password field cannot be empty"),
});

const Login = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const API_URL = "http://localhost:8080/api/auth/";

    useEffect(() => {
        if (userDetails.token !== "") {
            navigate('/', {replace: true});
        }
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const logIn = async () => {
        axios.post(API_URL + "signin", { username: formik.values.username, password: formik.values.password })
            .then(response => {
                if (response.data.token) {
                    dispatch(login(response.data));
                }

                navigate('/', { replace: true });
            })
            .catch(function(error) {
                if(error.response.status === 401) {
                    dispatch(showSnackbar("Incorrect login credentials", false));
                } else {
                    dispatch(showSnackbar("Error occurred during login attempt, please contact the administrator", false));
                }
            })
    }

    return (
        <Container maxWidth="sm" >
            <div data-testid='test-1'>

            </div>
                       
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 },border: '2px solid grey', width: 500,height: 300,borderRadius: '16px', borderWidth: '50%'}}
                noValidate
                autoComplete="off"
                marginTop={20}
                position='center'
                data-testid = 'test-1'
            >
                <Stack spacing={2}>
                    <Typography variant='h2' align='center'>Login</Typography>

                    <TextField
                        id={"username"}
                        name={"username"}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        label="Username"
                    />

                    <TextField
                        id={"password"}
                        name={"password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        label="Password"
                        type={"password"}
                    />
                    
                     
                    <Button  variant="contained" onClick={logIn} disabled={!(formik.isValid && formik.dirty)}>Log in</Button>
                    <Button variant="outlined" component={Link} to="../register">Create an account</Button>
                </Stack>
                </Box>
        </Container>
    );
};

export default Login;