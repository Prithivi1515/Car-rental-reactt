import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {TextField, Typography, Box, Select, Container, FormGroup, InputLabel, Button, Grid, MenuItem, FormHelperText, FormControl} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username field cannot be empty")
        .min(3, "Username is too short. Please enter a username between 3-20 characters long")
        .max(20, "Username is too long. Please enter a username between 3-20 characters long"),
    password: Yup.string()
        .required("Password field cannot be empty")
        .min(5, "Password is too short. Please enter a password between 5-120 characters long")
        .max(120, "Password is too long. Please enter a password between 5-120 characters long"),
    accountType: Yup.string()
        .required("You must select a user type"),
    email: Yup.string()
        .email('Invalid email')
        .required("E-mail field cannot be empty")
        .min(5, "E-mail address is too short. Please enter a e-mail address between 5-50 characters long")
        .max(50, "E-mail address is too long. Please enter a e-mail address between 5-50 characters long"),
});

const AddUser = () => {
    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";

    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        }
    },[userDetails.token]);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            accountType: "user",
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const addUser = async () => {
        axios.post(API_URL + '/user', {
            username: formik.values.username,
            email: formik.values.email,
            password: formik.values.password,
            role: formik.values.accountType
        },{
            headers: token,
        })
            .then(async () => {
                dispatch(showSnackbar("User successfully added", true));
                await delay(2000);
                navigate('/users', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 409) {
                    dispatch(showSnackbar("The username or email is already in use", false));
                } else {
                    dispatch(showSnackbar("Error occurred while adding user", false));
                }
            })
    }

    return (
        <Container maxWidth="md">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={10}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} alignItems={"center"}>
                        <Typography variant='h4' align='center'>Add new user</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
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
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"password"}
                                name={"password"}
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                label="Password"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"email"}
                                type="email"
                                name={"email"}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                label="E-mail"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Account type</InputLabel>
                            <Select
                                label="Account type"
                                id={"accountType"}
                                name={"accountType"}
                                value={formik.values.accountType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                            >
                                <MenuItem key={1} value={"admin"}>Administrator</MenuItem>
                                <MenuItem key={2} value={"user"}>User</MenuItem>
                            </Select>
                            {formik.touched.accountType && Boolean(formik.errors.accountType) && (
                                <FormHelperText>{formik.touched.accountType && formik.errors.accountType}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={addUser} disabled={!(formik.isValid && formik.dirty)} fullWidth>Add user</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AddUser;