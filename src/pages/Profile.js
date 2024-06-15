import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountPics from "../images/blank-profile-picture.png";
import {TextField, Typography, Box, Stack, Container, FormGroup, InputLabel, DialogContentText, DialogContent, DialogTitle, Dialog, DialogActions, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .required("Password field cannot be empty")
        .min(5, "Password is too short. Please enter a password between 5-120 characters long")
        .max(120, "Password is too long. Please enter a password between 5-120 characters long"),
    oldPassword: Yup.string()
        .required("Password field cannot be empty")
        .min(5, "Password is too short. Please enter a password between 5-120 characters long")
        .max(120, "Password is too long. Please enter a password between 5-120 characters long"),
});

const Profile = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const API_URL = "http://localhost:8080/api";

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            oldPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const editPassword = () => {
        axios.put(API_URL + '/user/changePassword', {
            userID: userDetails.id,
            oldPassword: formik.values.oldPassword,
            newPassword: formik.values.newPassword,
        },{
            headers: token
        })
            .then(async () => {
                setOpen(false);
                dispatch(showSnackbar("Password successfully changed", true));
                await delay(2000);
                navigate('/', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 422) {
                    dispatch(showSnackbar("Actually and new password cannot be the same", false));
                } else if (error.response.status === 403) {
                    dispatch(showSnackbar("Incorrect current password", false));
                } else if (error.response.status === 404) {
                    dispatch(showSnackbar("Error occurred while changing the password. The specified user doesn't exist", false));
                } else {
                    dispatch(showSnackbar("Error occurred while changing the password. Please contact the administrator", false));
                }
            })
    };

    useEffect(() => {
        if (userDetails.token === "") {
            navigate('/', {replace: true});
        }
    });

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Stack spacing={2}>
                    <img
                        src={AccountPics}
                        style={{ width: 200, height: 200, borderRadius: 200 / 2, alignSelf: 'center' }}
                        alt="Profile avatar"
                        loading="lazy"
                    />
            
                    <Typography variant='h3' align='center'>{userDetails.username}</Typography>

                    <FormGroup>
                        <InputLabel>
                            E-mail address
                        </InputLabel>
                        <TextField
                            value={userDetails.email}
                            readOnly
                        />
                    </FormGroup>
                    
                    <Button variant="contained" onClick={handleClickOpen}>Change password</Button>
                </Stack>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter current and new password, then confirm the changes with the button
                    </DialogContentText>
                    <TextField
                        id={"oldPassword"}
                        name={"oldPassword"}
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                        helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                        type={"password"}
                        label="Current password"
                        margin="dense"
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        id={"newPassword"}
                        name={"newPassword"}
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                        type={"password"}
                        label="New password"
                        margin="dense"
                        variant="standard"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={editPassword} disabled={!(formik.isValid && formik.dirty)}>Confirm changes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
  
export default Profile;