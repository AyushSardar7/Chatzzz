import { Box, IconButton, Stack, Typography } from '@mui/material'
import { CaretLeft } from 'phosphor-react'
import React, { useEffect } from 'react'
import ProfileForm from '../../sections/auth/ProfileFrom'
import { FetchUserProfile } from '../../redux/slices/app'
import { useDispatch } from 'react-redux'

const ProfilePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(FetchUserProfile());
    }, []);
    return (
        <>

            <Stack className='profilePage-main'
                direction={"row"}
                sx={{ width: "100%" }}>
                {/*Left*/}
                <Box className='profile-pannel'
                    sx={{
                        height: "100vh",
                        backgroundColor:
                            (theme) => theme.palette.mode === "light"
                                ? "#F8FAFF"
                                : theme.palette.background,
                        width: 320,
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
                    }}>
                    <Stack className='profile-pannel-items' p={4} spacing={5}>
                        {/* Header */}
                        <Stack className='heading' direction={"row"} alignItems={"center"} spacing={3}>
                            <IconButton>
                                <CaretLeft size={24} color={"4B4B4B"} />
                            </IconButton>
                            <Typography variant='h5'>
                                Profile
                            </Typography>
                        </Stack>
                        {/* Profile Form */}
                        <ProfileForm />
                    </Stack>
                </Box>
                {/* Right Pane */}
                <Box
                    sx={{
                        height: "100%",
                        width: "calc(100vw - 420px )",
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? "#FFF"
                                : theme.palette.background.paper,
                        borderBottom: "6px solid #0162C4",
                    }}
                ></Box>
            </Stack>
        </>

    )
}

export default ProfilePage
