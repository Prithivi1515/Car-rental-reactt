import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {TextField, Typography, Box, Select, Container, FormGroup, InputLabel, Button, Grid, MenuItem, FormHelperText, FormControl} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";
import {getFuelTypeName} from "../helpers/fuelTypes";

const AddCar = () => {
    const [fuelList, setFuelList] = useState([]);
    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const maxYear = new Date().getFullYear();

    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    useEffect(() => {
        if((userDetails.token !== "") && (userDetails.roles.includes("ROLE_ADMIN"))){
            axios.get(API_URL + '/fuels')
                .then((response) => {
                    if (response.data.length === 0) {
                        dispatch(showSnackbar("Error occurred while fetching the list of fuel types", false));
                        //await delay(2000);
                        navigate('/', {replace: true});
                    } else {
                        setFuelList(response.data);
                    }
                })
                .catch(async (error) => {
                    console.log(error);
                    dispatch(showSnackbar("Error occurred while fetching the list of fuel types", false));
                    // await delay(5000);
                    navigate('/', {replace: true});
                })
        } else {
            navigate('/', { replace: true });
        }
    }, [userDetails.token]);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const validationSchema = Yup.object({
        horsePower: Yup.number()
            .min(50, "The value of the car's horsepower is too small (min. is 50)")
            .required("Horse power field cannot be empty"),
        price: Yup.number()
            .min(50, "The daily rental amount for the car is too small (min. is 50 zł)")
            .required("Price field cannot be empty"),
        year: Yup.number()
            .min(1970, "The value for the car's production year is too small (min. is 1970)")
            .max(maxYear, "The car's production year is higher than the current year")
            .required("Production year field cannot be empty"),
        mileage: Yup.number()
            .min(1, "The mileage value for the car must be at least 1 km")
            .required("Mileage field cannot be empty"),
        brand: Yup.string()
            .min(3, "Brand name is too short")
            .max(30, "Brand name is too long")
            .required("Brand field cannot be empty"),
        model: Yup.string()
            .min(2, "Model name is too short")
            .max(30, "Model name is too long")
            .required("Model field cannot be empty"),
        capacity: Yup.string()
            .required("Capacity field cannot be empty"),
        fuelType: Yup.number()
            .required("You must select a fuel type")
            .min(1)
            .max(fuelList.length)
    });

    const formik = useFormik({
        initialValues: {
            horsePower: 50,
            price: 50,
            year: maxYear,
            mileage: 1,
            brand: "",
            model: "",
            capacity: "",
            fuelType: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const addCar = async () => {
        axios.post(API_URL + '/car', {
            horsePower: formik.values.horsePower,
            price: formik.values.price,
            year: formik.values.year,
            mileage: formik.values.mileage,
            brand: formik.values.brand,
            model: formik.values.model,
            capacity: formik.values.capacity,
            fuelType: formik.values.fuelType
        },{
            headers: token,
        })
            .then(async () => {
                dispatch(showSnackbar("Car successfully added", true));
                await delay(2000);
                navigate('/', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while adding the car", false));
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
                bgcolor='C8D2DC'
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} alignItems={"center"}>
                        <Typography variant='h4' align='center'>Add a new car</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"brand"}
                                name={"brand"}
                                value={formik.values.brand}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.brand && Boolean(formik.errors.brand)}
                                helperText={formik.touched.brand && formik.errors.brand}
                                label="Brand"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"model"}
                                name={"model"}
                                value={formik.values.model}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.model && Boolean(formik.errors.model)}
                                helperText={formik.touched.model && formik.errors.model}
                                label="Model"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"capacity"}
                                name={"capacity"}
                                value={formik.values.capacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                                helperText={formik.touched.capacity && formik.errors.capacity}
                                label="Capacity"
                                placeholder="e.g. '2.0 TFSI'"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"horsePower"}
                                name={"horsePower"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 50 } }}
                                value={formik.values.horsePower}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.horsePower && Boolean(formik.errors.horsePower)}
                                helperText={formik.touched.horsePower && formik.errors.horsePower}
                                label="Horse power"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"year"}
                                name={"year"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 1970, max: maxYear } }}
                                value={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.year && Boolean(formik.errors.year)}
                                helperText={formik.touched.year && formik.errors.year}
                                label="Production year"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"mileage"}
                                name={"mileage"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 1 } }}
                                value={formik.values.mileage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mileage && Boolean(formik.errors.mileage)}
                                helperText={formik.touched.mileage && formik.errors.mileage}
                                label="Mileage"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormGroup>
                            <TextField
                                id={"price"}
                                name={"price"}
                                type={"number"}
                                InputProps={{ inputProps: { min: 50 } }}
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                                label="Price per day"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Fuel type</InputLabel>
                            <Select
                                label="Fuel type"
                                id={"fuelType"}
                                name={"fuelType"}
                                value={formik.values.fuelType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fuelType && Boolean(formik.errors.fuelType)}
                            >
                                { fuelList && fuelList.length > 0 && (
                                    fuelList.map((fuel, index) => {
                                        return (
                                            <MenuItem key={index} value={fuel.id}>{getFuelTypeName(fuel.name)}</MenuItem>
                                        );
                                    })
                                )}
                            </Select>
                            {formik.touched.fuelType && Boolean(formik.errors.fuelType) && (
                                <FormHelperText>{formik.touched.fuelType && formik.errors.fuelType}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={addCar} disabled={!(formik.isValid && formik.dirty)} fullWidth>Add car</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AddCar;