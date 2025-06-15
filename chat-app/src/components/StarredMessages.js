import { useTheme } from '@mui/material/styles'
import { Box,  IconButton, Stack,  Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux';
import { UpdateSidebarType } from '../redux/slices/app';
import { CaretLeft } from 'phosphor-react';
import Msgs from './Conversation/Msgs';
import { ScrollableStack } from './ScrollTool';
import useResponsive from '../hooks/useResponsive';



const StarredMessages = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isDesktop = useResponsive("up", "md");

    return (
        <Box className='Starred message'  sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
            <Stack className="main" sx={{ height: "100%" }}>
                {/*Header*/}
                <Box className='header-box'
                    sx={{
                        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
                        width: "100%",
                        backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background,
                    }}>
                    <Stack className='header-content'
                        sx={{ height: "100%", p: 2 }}
                        direction={"row"}
                        alignItems={"center"}
                        spacing={3}
                    >
                        <IconButton onClick={() => {
                            dispatch(UpdateSidebarType("CONTACT"));
                        }}>
                            <CaretLeft />
                        </IconButton>
                        <Typography variant="subtitle2">Starred Messages</Typography>

                    </Stack>
                </Box>
                  
                {/*Body*/}
                <ScrollableStack className='body'
                    sx={{
                        height: "100%",
                        position: "relative",
                        flexGrow: 1,
                        overflowY: "scroll"
                    }} p={3}
                    spacing={ 3} timeout={500}
                    clickOnTrack={false}
                    >
                    <Msgs/>   
                </ScrollableStack>
            </Stack>
        </Box>

    )
}

export default  StarredMessages
