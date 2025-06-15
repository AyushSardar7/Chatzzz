import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, Stack, Typography } from '@mui/material'
import React from 'react';


const Shortcuts = ({ open, handleClose }) => {
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    const list = [
        {
            key: 0,
            title: "Mark as unread",
            combination: ["Cmd", "Shift", "U"],
        },
        {
            key: 1,
            title: "Mute",
            combination: ["Cmd", "Shift", "M"],
        },
        {
            key: 2,
            title: "Archive Chat",
            combination: ["Cmd", "Shift", "E"],
        },
        {
            key: 3,
            title: "Delete Chat",
            combination: ["Cmd", "Shift", "D"],
        },
        {
            key: 4,
            title: "Pin Chat",
            combination: ["Cmd", "Shift", "P"],
        },
        {
            key: 5,
            title: "Search",
            combination: ["Cmd", "F"],
        },
        {
            key: 6,
            title: "Search Chat",
            combination: ["Cmd", "Shift", "F"],
        },
        {
            key: 7,
            title: "Next Chat",
            combination: ["Cmd", "N"],
        },
        {
            key: 8,
            title: "Next Step",
            combination: ["Ctrl", "Tab"],
        },
        {
            key: 9,
            title: "Previous Step",
            combination: ["Ctrl", "Shift", "Tab"],
        },
        {
            key: 10,
            title: "New Group",
            combination: ["Cmd", "Shift", "N"],
        },
        {
            key: 11,
            title: "Profile & About",
            combination: ["Cmd", "P"],
        },
        {
            key: 12,
            title: "Increase speed of voice message",
            combination: ["Shift", "."],
        },
        {
            key: 13,
            title: "Decrease speed of voice message",
            combination: ["Shift", ","],
        },
        {
            key: 14,
            title: "Settings",
            combination: ["Shift", "S"],
        },
        {
            key: 15,
            title: "Emoji Panel",
            combination: ["Cmd", "E"],
        },
        {
            key: 16,
            title: "Sticker Panel",
            combination: ["Cmd", "S"],
        },
    ];

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
                sx={{ px:2, pt:2 }}
                keepMounted
                TransitionComponent={Transition}
            >
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <DialogContent sx={{ mt: 2.5, maxHeight: "100vh",overflow:"hidden"}} >
                    <Grid container spacing={2.5} >
                        {
                            list.map(({ key, title, combination }) => (
                                <Grid key={key} container item xs={6} >
                                        <Stack
                                            className='commands'
                                            sx={{ width: "100%" }}
                                            justifyContent={"space-between"}
                                            direction={"row"}
                                            alignItems={"center"}
                                        >
                                            <Typography variant='caption' sx={{ fontSize: 14 }}>{title}</Typography>
                                            <Stack className='buttons' spacing={2} direction={"row"}>
                                                {combination.map((el, index) => (
                                                    <Button key={index} disabled variant='contained' sx={{ color: "#212121" }}>
                                                        {el}
                                                    </Button>
                                                ))}
                                            </Stack>
                                        </Stack>     
                                </Grid>
                            ))
                        }

                    </Grid>
                </DialogContent>
                <DialogActions>
                <Button variant='contained' onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Shortcuts
