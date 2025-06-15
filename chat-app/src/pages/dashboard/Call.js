import { useTheme } from '@mui/material/styles';
import { Box, Button, Divider, IconButton,Link, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { ArchiveBox, MagnifyingGlass, Phone } from 'phosphor-react';
import { ScrollableStack } from '../../components/ScrollTool';
import { CallLogElement } from '../../components/CallElement';
import { CallHistory } from '../../data';
import StartCall from '../../sections/main/StartCall';

const Call = () => {
    const theme = useTheme();
    const [openDailog,setOpenDailog]=useState(false);
    
    const handleCloseDailog=()=>{
        setOpenDailog(false);
      }
    
    return (
        <>
            <Stack className='call-main'
                direction={"row"}
                sx={{ width: "100%" }}>
                {/*Left*/}
                <Box className='call-pannel'
                    sx={{
                        height: "100vh",
                        backgroundColor:
                            (theme) => theme.palette.mode === "light"
                                ? "#F8FAFF"
                                : theme.palette.background,
                        width: 320,
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
                    }}>
                    <Stack className='call-pannel-items' p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
                        <Stack className='title'>
                            <Typography variant='h5'>
                                Calls
                            </Typography>
                        </Stack>
                        <Stack className='search' sx={{ width: "100%" }}>
                            <Search>
                                <SearchIconWrapper>
                                    <MagnifyingGlass color='#709CE6' size={24} />
                                </SearchIconWrapper>
                                <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
                            </Search>
                        </Stack>
                        <Stack className='call-icon'
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Typography variant='subtitle2' component={Link}>Start Conversation</Typography>
                            <IconButton onClick={()=>{
                                setOpenDailog(true);
                            }}>
                                <Phone style={{ color: theme.palette.primary.main }} />
                            </IconButton>
                        </Stack>
                        <Divider />
                        <Stack spacing={1} >
                            <Stack direction="row" alignItems={"center"} spacing={1.5}>
                                <ArchiveBox size={24} />
                                <Button>Archive</Button>
                            </Stack>
                        </Stack>
                        <ScrollableStack className='group-messages'spacing={3}
                            sx={{
                                flexGrow: 1,
                                overflowY: "scroll",
                                height: "100%"
                            }}>
                           <Stack className='call-history' spacing={2.5}>
                             {/* */}
                             {/*Call Logs*/}
                             {CallHistory.map((el)=>(
                                <CallLogElement {...el}/>
                             ))}
                           </Stack>
                        </ScrollableStack>
                    </Stack>
                </Box>
                {/*Right*/}
            </Stack>
            {openDailog && <StartCall open={openDailog} handleClose={handleCloseDailog}/>}
        </>
    )
}

export default Call;
