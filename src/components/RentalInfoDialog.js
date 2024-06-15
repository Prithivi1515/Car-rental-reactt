import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ListItem, List, ListItemText} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import {getStatusName} from "../helpers/rentalStatusNames";

export default function RentalInfoDialog(props){
    const userDetails = useSelector((state) => state.userDetails);

    const [openDialog, setOpenDialog] = useState(false);
    const [rentalHistory] = useState(props.statusHistory);
    let navigate = useNavigate();

    useEffect(() => {
        if (userDetails.token === "") {
            navigate('/', {replace: true});
        }
    },[userDetails.token]);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    handleClickOpen();
                }}
            >
                <InfoIcon fontSize="small" />
            </Button>

            <Dialog open={openDialog} onClose={handleClose} maxWidth={"xs"} fullWidth>
                <DialogTitle>Status change history</DialogTitle>

                <DialogContent>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                        }}
                    >
                        {rentalHistory && rentalHistory.length > 0 ? (
                            rentalHistory.map((item) => (
                                <>
                                    <ListItem>
                                        <ListItemText primary={getStatusName(item.statusAfterChange.name)} secondary={item.changeDate} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText align="center" primary={"No data to display"} />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}