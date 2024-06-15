import React, { useEffect, useState } from "react";
import axios from "axios";
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeImageDialog from "../components/ChangeImageDialog";
import CarInfoDialog from "../components/CarInfoDialog";
import {showSnackbar} from "../actions/snackbarActions";
import {getFuelTypeName} from "../helpers/fuelTypes";
import {getCarStatusName} from "../helpers/carStatusNames";

const CarList = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [cars, setCars] = useState([]);

    const getCars = () => {
        axios.get(API_URL + '/cars',{
            headers: token
        })
            .then((response) => {
                setCars(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error while fetching the list of cars", false));
            })
    };

    const deleteCar = (id) => {
        axios.delete(API_URL + '/car/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Car successfully deleted", true));
                getCars();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while deleting the car", false));
            })
    };

    const changeCarStatus = (id) => {
        axios.put(API_URL + '/car/'+id+'/status', {}, {
            headers: token
        })
            .then(() => {
                dispatch(showSnackbar("Car availability status changed successfully", true));
                getCars();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while changing the availability status of the car", false));
            })
    };

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        } else {
            getCars();
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
                <Typography variant='h4' align='center'>Car list</Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/car/add')
                    }}
                >
                    Add car
                </Button>
                <Stack spacing={2}>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">Brand and model</TableCell>
                                    <TableCell align="center">Production year</TableCell>
                                    <TableCell align="center">Fuel type</TableCell>
                                    <TableCell align="center">Price per day</TableCell>
                                    <TableCell align="center">Available</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cars && cars.length > 0 ? (
                                    cars.map((car, index) => (
                                        <TableRow
                                            key={car.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{index+1}</TableCell>
                                            <TableCell align="center">{car.brand.name + ' ' + car.model.name}</TableCell>
                                            <TableCell align="center">{car.year}</TableCell>
                                            <TableCell align="center">{getFuelTypeName(car.fuelType.name)}</TableCell>
                                            <TableCell align="center">{car.price + ' PLN'}</TableCell>
                                            <TableCell align="center">{getCarStatusName(car.available)}</TableCell>
                                            <TableCell align="center">
                                                <ChangeImageDialog carID={car.id} cars={[setCars]} />
                                                &nbsp;
                                                <CarInfoDialog carInfo={car} />
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        changeCarStatus(car.id);
                                                    }}
                                                >
                                                    <ChangeCircleIcon fontSize="small" />
                                                </Button>
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => {
                                                        navigate(`/car/edit/${car.id}`)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>
                                                &nbsp;
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        deleteCar(car.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))) : (
                                    <TableRow><TableCell colSpan={8}><h2 align="center">No cars to display</h2></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Box>
        </Container>
    );
};

export default CarList;