import { Box, Button, Divider, IconButton, Link, Stack, Typography } from '@mui/material'
import { useTheme } from "@mui/material/styles"
import { ArchiveBox, MagnifyingGlass, Plus } from 'phosphor-react'
import React, { useState } from 'react'
import { ScrollableStack } from '../../components/ScrollTool'
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search'
import { ChatList } from '../../data'
import ChatElement from '../../components/ChatElement'
import CreateGroup from '../../sections/main/CreateGroup'

const Group = () => {
    const theme = useTheme();
    const [openDailog,setOpenDailog]=useState(false);
    
    const handleCloseDailog=()=>{
        setOpenDailog(false);
      }
    
    return (
        <>
            <Stack className='group-main'
                direction={"row"}
                sx={{ width: "100%" }}>
                {/*Left*/}
                <Box className='group-chat-pannel'
                    sx={{
                        height: "100vh",
                        backgroundColor:
                            (theme) => theme.palette.mode === "light"
                                ? "#F8FAFF"
                                : theme.palette.background,
                        width: 320,
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)"
                    }}>
                    <Stack className='gorup-pannel-items' p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
                        <Stack className='title'>
                            <Typography variant='h5'>
                                Groups
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
                        <Stack className='group-icon'
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Typography variant='subtitle2' component={Link}>Create New Group</Typography>
                            <IconButton onClick={()=>{
                                setOpenDailog(true);
                            }}>
                                <Plus style={{ color: theme.palette.primary.main }} />
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
                            <Stack className='types' spacing={2.5}>
                                {/* */}
                                <Typography variant='subtitle2' sx={{ color: "#676767" }}>Pinned</Typography>
                                {/*Chat List*/}
                                {ChatList.filter((el) => el.pinned).map((el) => {
                                    return <ChatElement key={el.id} {...el} />
                                })}
                                 {/* */}
                                 <Typography variant='subtitle2' sx={{ color: "#676767" }}>All Groups</Typography>
                                {/*Chat List*/}
                                {ChatList.filter((el) => !el.pinned).map((el) => {
                                    return <ChatElement key={el.id} {...el} />
                                })}
                            </Stack>
                        </ScrollableStack>
                    </Stack>
                </Box>
                {/*Right*/}

            </Stack>
            {openDailog && <CreateGroup open={openDailog} handleClose={handleCloseDailog}/>}
        </>
    )
}

export default Group
