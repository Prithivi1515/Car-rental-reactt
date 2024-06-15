import React, {useEffect, useState} from "react";
import axios from "axios";
import {Card, CardActions, CardContent, CardMedia, Typography, Button, Grid, Stack, Paper} from "@mui/material";
import EditIcon  from '@mui/icons-material/Edit';
import DeleteIcon  from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import AuthHeader from "../services/authHeader";
import ChangeImageDialog from "../components/ChangeImageDialog";
import CarRentalDialog from "../components/CarRentalDialog";
import {showSnackbar} from "../actions/snackbarActions";
import {getFuelTypeName} from "../helpers/fuelTypes";

const Home = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const token = AuthHeader();

    const [cars, setCars] = useState([]);
    let navigate = useNavigate();
    const API_URL = "http://localhost:8080/api";

    useEffect(() => {
        getCarsList();
    }, []);

    const getCarsList = async () => {
        axios.get(API_URL + '/cars/available')
            .then((response) => {
                setCars(response.data);
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while fetching the list of available cars. Please contact the administrator", false));
            })
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const deleteCar = async (id) => {
        axios.delete(API_URL + '/car/'+id, {
            headers: token
        })
            .then(async () => {
                dispatch(showSnackbar("Car successfully deleted", true));
                await getCarsList();
            })
            .catch((error) => {
                console.log(error);
                dispatch(showSnackbar("Error occurred while deleting the car", false));
            })
    };

    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={5}>
                {cars && cars.length > 0 ? (
                    cars.map((car, index) => {
                        return (
                            <Grid item xs={3} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        alt={car.brand.name + car.model.name}
                                        height="250"
                                        image={"data:image/jpeg;base64,"+car.carImage.fileContent}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" textAlign="center">
                                            {car.brand.name + " " + car.model.name + " (" + car.year + ")"}
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Item>Mileage: {car.mileage} km</Item>
                                            <Item>Engine: {car.capacity + ", " + car.horsePower + " HP"}</Item>
                                            <Item>Fuel: {getFuelTypeName(car.fuelType.name)}</Item>
                                            <Item>Price per day: {car.price + " PLN"}</Item>
                                        </Stack>
                                    </CardContent>
                                    <CardActions style={{justifyContent: 'center'}}>
                                        {userDetails.token !== "" && (
                                            <CarRentalDialog carID={car.id} price={car.price} />
                                        )}

                                        {userDetails.roles.includes("ROLE_ADMIN") && (
                                            <>
                                                &nbsp;
                                                <ChangeImageDialog carID={car.id} cars={[setCars]} />

                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => {
                                                        navigate(`/car/edit/${car.id}`)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        deleteCar(car.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </Button>
                                            </>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item xs={12} marginTop={20}>
                        <Typography variant='h5' align='center'>No cars available for display</Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
};
  
export default Home;