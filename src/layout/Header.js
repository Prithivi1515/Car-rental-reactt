import React from 'react';
import { Toolbar, Typography } from '@mui/material';
import CarRentalIcon from '@mui/icons-material/CarRental';
import Navigation from './Navigation';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Toolbar disableGutters>
           
            <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: '#212F3D',
                    textDecoration: 'none',
                    border: "dotted 2px"
                }}
            >
                 <CarRentalIcon sx={{ display: { xs: 'flex', md: 'flex' ,color:"#212F3D", border:"ButtonFace"}, mr: 1 }} />
                Car Rental System
            </Typography>
            
            <Navigation />
        </Toolbar>
    );
};

export default Header;