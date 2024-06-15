import React, { useEffect, useState } from "react";
import axios from "axios";
import {Typography, Box, Stack, Container, TableRow, TableCell, TableHead, TableBody, Table, TableContainer, Paper} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../services/authHeader";
import RentalInfoDialog from "../components/RentalInfoDialog";
import {showSnackbar} from "../actions/snackbarActions";
import {getStatusName} from "../helpers/rentalStatusNames";

const MyRentals = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";
    const [rentals, setRentals] = useState([]);

    const getRentals = () => {
        axios.get(API_URL + '/rentals/'+userDetails.id,{
            headers: token
        })
            .then((response) => {
                setRentals(response.data);
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while fetching the list of rentals. Please contact the administrator", false));
            })
    };

    useEffect(() => {
        if (userDetails.token === "") {
            navigate('/', {replace: true});
        } else {
            getRentals();
        }
    }, [userDetails.token]);

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
                    <Typography variant='h4' align='center'>My rentals</Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">Date created</TableCell>
                                    <TableCell align="center">Rental period</TableCell>
                                    <TableCell align="center">Auto</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Cost</TableCell>
                                    <TableCell align="center">Details</TableCell>
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
                                        <TableCell align="center"><RentalInfoDialog statusHistory={rental.statusHistory} /></TableCell>
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

export default MyRentals;