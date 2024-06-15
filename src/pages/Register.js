import React, { useEffect } from 'react';
import { Typography, TextField, Box, Button, Stack, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";
import { spacing } from '@mui/system';

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username field cannot be empty")
        .min(3, "Username is too short. Please enter a username between 3-20 characters long")
        .max(20, "Username is too long. Please enter a username between 3-20 characters long"),
    password: Yup.string()
        .required("Password field cannot be empty")
        .min(5, "Password is too short. Please enter a password between 5-120 characters long")
        .max(120, "Password is too long. Please enter a password between 5-120 characters long"),
    confirmPassword: Yup.string()
        .required("Confirm password field cannot be empty")
        .min(5, "Password is too short. Please enter a password between 5-120 characters long")
        .max(120, "Password is too long. Please enter a password between 5-120 characters long")
        .oneOf([Yup.ref('password')], "Passwords do not match. Make sure the repeated password matches the password"),
    email: Yup.string()
        .email('Invalid email')
        .required("E-mail field cannot be empty")
        .min(5, "E-mail address is too short. Please enter a e-mail address between 5-50 characters long")
        .max(50, "E-mail address is too long. Please enter a e-mail address between 5-50 characters long"),
});

const Register = () => {
    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api/auth/";
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);

    useEffect(() => {
        if (userDetails.token !== "") {
            navigate('/', {replace: true});
        }
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const signUp = async () => {
        axios.post(API_URL + "signup", {
            username: formik.values.username,
            email: formik.values.email,
            password: formik.values.password
        })
            .then(() => {
                navigate('/login', {replace: true});
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.status === 409) {
                    dispatch(showSnackbar("The username or email is already in use", false));
                } else {
                    dispatch(showSnackbar("Error occurred while attempting to register. Please contact the administrator", false));
                }
            })
    }

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 },border: '2px solid grey', width: 500,height: 430,borderRadius: '10px'}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Stack spacing={2}>
                    <Typography variant='h3' align='center'>Registration</Typography>

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
                        id={"email"}
                        name={"email"}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        label="E-mail address"
                        type={"email"}
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

                    <TextField
                        id={"confirmPassword"}
                        name={"confirmPassword"}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        label="Confirm password"
                        type={"password"}
                    />
                
                    <Button sx = {{width: 200 , mr: 2}}variant="contained" onClick={signUp} disabled={!(formik.isValid && formik.dirty)}>Sign up</Button>
                    <Button variant="outlined" component={Link} to="../login">Already have an account? Log in</Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default Register;