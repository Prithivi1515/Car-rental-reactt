import CarRentalIcon from "@mui/icons-material/CarRental";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthHeader from "../services/authHeader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {showSnackbar} from "../actions/snackbarActions";
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object({
    rentalStartDate: Yup.date()
        .required("Rental start date is required"),
    rentalEndDate: Yup.date()
        .required('Rental end date is required')
        .when('rentalStartDate', (rentalStartDate, schema) => {
            return rentalStartDate ? schema.min(rentalStartDate, 'End date must be after or equal to start date') : schema;
        })
        .test('end-date-greater', 'End date must be greater than or equal to start date', function (value) {
            const start = this.resolve(Yup.ref('rentalStartDate'));
            return start && value ? value >= start : true;
        }),
});

export default function CarRentalDialog(props){
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();
    const API_URL = "http://localhost:8080/api";

    const [openRentalDialog, setOpenRentalDialog] = useState(false);
    const [carPrice] = useState(props.price);
    const [rentalCost, setRentalCost] = useState(0);
    const [carID] = useState(props.carID);
    let navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            rentalStartDate: new Date().toISOString().slice(0, 10),
            rentalEndDate: new Date().toISOString().slice(0, 10),
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    useEffect(() => {
        handleChangeRentalDate();
    }, [formik.values.rentalStartDate, formik.values.rentalEndDate]);

    const handleClickOpenRentalDialog = () => {
        setOpenRentalDialog(true);
    };

    const handleCloseRentalDialog = () => {
        setOpenRentalDialog(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleChangeRentalDate = () => {
        let difference = new Date(formik.values.rentalEndDate).getTime() - new Date(formik.values.rentalStartDate).getTime();
        setRentalCost(carPrice * (Math.ceil(difference / (1000 * 3600 * 24))+1));
    };

    const addCarRental = async () => {
        axios.post(API_URL + '/rental', {
            carID: carID,
            userID: userDetails.id,
            startDate: formik.values.rentalStartDate,
            addDate: new Date().toISOString().slice(0, 10),
            endDate: formik.values.rentalEndDate
        },{
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Car rental request submitted successfully", true));
                handleCloseRentalDialog();
                await delay(2000);
                navigate('/my-rentals');
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    dispatch(showSnackbar("The specified car was not found", false));
                } else if (error.response.status === 400) {
                    dispatch(showSnackbar("Invalid car rental date range entered", false));
                } else {
                    dispatch(showSnackbar("Error occurred while attempting to rent the car. Please contact the administrator", false));
                }
            })
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => {
                    handleClickOpenRentalDialog();
                }}
            >
                <CarRentalIcon fontSize="small" />
            </Button>

            <Dialog open={openRentalDialog} onClose={handleCloseRentalDialog}>
                <DialogTitle>Rent a car</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Select the rental period, then confirm using the button
                    </DialogContentText>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel>Rental start date</InputLabel>
                        <TextField
                            id={"rentalStartDate"}
                            type={"date"}
                            name={"rentalStartDate"}
                            value={formik.values.rentalStartDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rentalStartDate && Boolean(formik.errors.rentalStartDate)}
                            helperText={formik.touched.rentalStartDate && formik.errors.rentalStartDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel>Rental end date</InputLabel>
                        <TextField
                            id={"rentalEndDate"}
                            type={"date"}
                            name={"rentalEndDate"}
                            value={formik.values.rentalEndDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rentalEndDate && Boolean(formik.errors.rentalEndDate)}
                            helperText={formik.touched.rentalEndDate && formik.errors.rentalEndDate}
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                    <FormGroup sx={{ mb: 1 }}>
                        <InputLabel> Rental cost </InputLabel>
                        <TextField
                            value={Boolean(formik.isValid) ? (rentalCost + ' zł') : ( ' - zł ')}
                            readOnly
                            margin="dense"
                            variant="standard"
                            fullWidth
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={addCarRental} disabled={!(formik.isValid)}>Send request</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}