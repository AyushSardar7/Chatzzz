import { useTheme } from '@mui/material/styles'
import { Box, Grid, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { UpdateSidebarType } from '../redux/slices/app';
import { CaretLeft } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import { SHARED_DOC, SHARED_LINKS } from '../data';
import { DocMsg, LinkMsg } from './Conversation/MsgTypes';
import { ScrollableStack } from './ScrollTool';
import useResponsive from '../hooks/useResponsive';



const SharedMessages = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [value, setValue] = useState(0);
    const isDesktop = useResponsive("up", "md");

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
        <Box className='Shared message'  sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
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
                        <Typography variant="subtitle2">Shared Messages</Typography>

                    </Stack>
                </Box>
                    <Tabs sx={{px:2, pt:2}} value={value} onChange={handleChange} centered>
                        <Tab label="Media" />
                        <Tab label="Links" />
                        <Tab label="Docs" />
                    </Tabs>
                {/*Body*/}
                <ScrollableStack className='body'
                    sx={{
                        height: "100%",
                        position: "relative",
                        flexGrow: 1,
                        overflowY: "scroll"
                    }} p={3}
                    spacing={value===1? 1 : 3} timeout={500}
                    clickOnTrack={false}>
                        {(()=>{
                            switch (value) {
                                case 0:
                                    //Images 
                                    return(
                                    <Grid container spacing={2}>
                                        {[0,1,2,3,4,5,6,7,8,9].map((el)=>(
                                            <Grid item xs={4}>
                                                <img
                                                 src={faker.image.avatar()} 
                                                alt={faker.name.fullName} 
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    );
                                case 1:
                                    //Links
                                    return SHARED_LINKS.map((el)=> <LinkMsg el={el}/>)
                                case 2:
                                    //Docs
                                    return SHARED_DOC.map((el)=> <DocMsg el={el}/>)
                                default:
                                    break;
                            }
                        })()}
                </ScrollableStack>
            </Stack>
        </Box>

    )
}

export default SharedMessages
