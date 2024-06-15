import React, { useEffect, useState } from "react";
import axios from "axios";
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import DeleteIcon  from '@mui/icons-material/Delete';
import RentalInfoDialog from "../components/RentalInfoDialog";
import ChangeRentalStatusDialog from "../components/ChangeRentalStatusDialog";
import {showSnackbar} from "../actions/snackbarActions";
import ChangeCarRentalDialog from "../components/ChangeCarRentalDialog";
import {getStatusName} from "../helpers/rentalStatusNames";

const Rentals = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [statusList, setStatusList] = useState([]);
    const [rentals, setRentals] = useState([]);

    const getRentals = () => {
        axios.get(API_URL + '/rentals',{
            headers: token
        })
            .then((response) => {
                setRentals(response.data)
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while fetching the list of rentals", false));
            })
    };

    const deleteRental = (id) => {
        axios.delete(API_URL + '/rental/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Rental deleted successfully", true));
                getRentals();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while deleting the rental", false));
            })
    };

    useEffect(() => {
        if (!userDetails.roles.includes('ROLE_ADMIN')) {
            navigate('/', {replace: true});
        } else {
            getRentals();
            getStatusList();
        }
    },[userDetails.token]);

    const getStatusList = () => {
        axios.get(API_URL + '/rental-statuses')
            .then((response) => {
                if (response.data.length === 0) {
                    dispatch(showSnackbar("Error occurred while retrieving the list of rental statuses", false));
                    navigate('/', {replace: true});
                } else {
                    setStatusList(response.data);
                }
            })
            .catch(async (error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while retrieving the list of rental statuses", false));
                //await delay(2000);
                navigate('/', {replace: true});
            })
    };

    return (
        <Container maxWidth="lg">
            <Box
                component="form"
                sx={{'& .MuiTextField-root': { m: 1 }}}
                noValidate
                autoComplete="off"
                marginTop={20}
            >
                <Stack spacing={2}>
                    <Typography variant='h4' align='center'>Rental list</Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">Date created</TableCell>
                                    <TableCell align="center">Rental period</TableCell>
                                    <TableCell align="center">Car</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Cost</TableCell>
                                    <TableCell align="center">Customer</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rentals && rentals.length > 0 ? (
                                    rentals.map((rental, index) => (
                                    <TableRow
                                        key={rental.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index+1}
                                        </TableCell>
                                        <TableCell align="center">{rental.addDate}</TableCell>
                                        <TableCell align="center">{rental.startDate + ' - ' + rental.endDate}</TableCell>
                                        <TableCell align="center">{rental.car.brand.name + ' ' + rental.car.model.name}</TableCell>
                                        <TableCell align="center">{getStatusName(rental.rentalStatus.name)}</TableCell>
                                        <TableCell align="center">{rental.price + ' PLN'}</TableCell>
                                        <TableCell align="center">{rental.user.username}</TableCell>
                                        <TableCell align="center">
                                            <RentalInfoDialog statusHistory={rental.statusHistory} />
                                            &nbsp;
                                            <ChangeRentalStatusDialog
                                                setRentals={[setRentals]}
                                                statusList={statusList}
                                                status={rental.rentalStatus}
                                                rentalID={rental.id}
                                            />
                                            &nbsp;
                                            <ChangeCarRentalDialog
                                                rentalID={rental.id}
                                                startDate={rental.startDate}
                                                endDate={rental.endDate}
                                                carPrice={rental.car.price}
                                            />
                                            &nbsp;
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    deleteRental(rental.id);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                    <TableRow><TableCell colSpan={8}><h2 align="center">No rentals to display</h2></TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Box>
        </Container>
    );
};

export default Rentals;