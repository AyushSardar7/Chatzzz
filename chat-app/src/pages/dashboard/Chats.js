import { Box, IconButton, Typography, Stack, Button, Divider } from '@mui/material';
import { ArchiveBox, CircleDashed, MagnifyingGlass, Users } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { ScrollableStack } from '../../components/ScrollTool';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import ChatElement from '../../components/ChatElement';
import Freinds from '../../sections/main/Freinds';
import { socket } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import {FetchtConversations } from '../../redux/slices/converstion';


const user_id=window.localStorage.getItem("user_id")
const Chats = () => {
  const [openDialog, setOpenDailog] = useState(false);
  const theme = useTheme();
  const dispatch=useDispatch();

  const {conversations}=useSelector((state)=>state.conversation.direct_chat)
  const handleCloseDialog = () => {
    setOpenDailog(false);
  };
  const handleOpenDialog = () => {
    setOpenDailog(true);
  };

  useEffect(()=>{
      //list of conversations
      dispatch(FetchtConversations());
  
  },[dispatch])

  useEffect(() => {
    console.log("Conversations state updated:", conversations);
  }, [conversations]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: 320,
          backgroundColor: theme.palette.mode === 'light' ? "#F8FAFF" : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Chats
            </Typography>
            <Stack className='icons' direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}
              >
                <Users />
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Box>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color='#709CE6' size={24} />
              </SearchIconWrapper>
              <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
            </Search>
          </Stack>
          <Stack spacing={1} >
            <Stack direction="row" alignItems={"center"} spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <ScrollableStack spacing={2} direction={"column"} sx={{ flexGrow: 1 }} timeout={500} clickOnTrack={false}>
            {/* <Stack spacing={2.4}>
              <Typography variant='subtitle2' sx={{ color: "#676767" }}>Pinned</Typography>
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement key={el.id} {...el} />
              })}

            </Stack> */}
            <Stack spacing={2.4}>
              <Typography variant='subtitle2' sx={{ color: "#676767" }}>All Chats</Typography>
              {conversations.filter((el) => !el.pinned).map((el) => {
                return <ChatElement key={el.id} {...el} />
              })}

            </Stack>
          </ScrollableStack>
        </Stack>
      </Box>
      {openDialog && (<Freinds open={openDialog} handleClose={handleCloseDialog} />)}
    </>
  );
};

export default Chats;
