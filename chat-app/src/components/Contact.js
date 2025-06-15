import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Slide, Stack, Typography } from '@mui/material';
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X } from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleSidebar, UpdateSidebarType } from '../redux/slices/app';
import AntSwitch from './AntSwitch';
import { faker } from '@faker-js/faker';
import { ScrollableStack } from './ScrollTool';
import useResponsive from '../hooks/useResponsive';
import { StartAudioCall } from '../redux/slices/audioCall';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlaockDailog = ({ open, handleClose }) => {

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Block this contact</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to block this Contact?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions>
    </Dialog>
  )
}
const DeleteDailog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this Chat?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions>
    </Dialog>
  )
}

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { current_conversation } = useSelector((state) => state.conversation.direct_chat);

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const isDesktop = useResponsive("up", "md");

  const handleCloseBlock = () => {
    setOpenBlock(false);
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }

  return (
    <Box className='Contact' sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
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
            justifyContent={"space-between"}
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton onClick={() => {
              dispatch(ToggleSidebar());
            }}>
              <X />
            </IconButton>
          </Stack>
        </Box>
        {/*Body*/}
        <ScrollableStack className='body' sx={{ height: "100%", position: "relative", flexGrow: 1, overflowY: "scroll" }} p={3} spacing={2} timeout={500} clickOnTrack={false}>
          <Stack className='image-horizontal' alignItems={"center"} direction={"row"} spacing={2}>
            <Avatar src={current_conversation?.img} alt={current_conversation?.name} sx={{ height: 64, width: 64 }} />
            <Stack spacing={0.5}>
              <Typography variant='article' fontWeight={600}>
                {current_conversation?.name}
              </Typography>
              <Typography variant='body2' fontWeight={500}>
                {'123 234 231 1213'}
              </Typography>
            </Stack>
          </Stack>
          <Stack className='call-icon'
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <Stack className='call-name' spacing={1} alignItems={"center"}>
              <IconButton onClick={() => {
                dispatch(StartAudioCall(current_conversation.user_id));
              }}>
                <Phone />
              </IconButton>
              <Typography variant='overline'>Phone</Typography>
            </Stack>
            <Stack className='call-name' spacing={1} alignItems={"center"}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant='overline'>Video</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack className='about us' spacing={0.5}>
            <Typography variant='article'>About</Typography>
            <Typography variant='body2'>Stresss</Typography>
          </Stack>
          <Divider />
          <Stack className='media-text' direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Typography variant='subtitle2'>Media ,Links & Docs</Typography>
            <Button endIcon={<CaretRight />}
              onClick={() => {
                dispatch(UpdateSidebarType("SHARED"))
              }}>
              401</Button>
          </Stack>
          <Stack className='media-images' direction={"row"} spacing={2} alignItems={"center"}>
            {[1, 2, 3].map((el) => (
              <Box>
                <img src={faker.image.city()} alt={faker.name.fullName()} />
              </Box>
            ))}
          </Stack>
          <Divider />
          <Stack className='starred-message' direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Star size={21} />
              <Typography variant='subtitle2'>Starred messages</Typography>
            </Stack>
            <IconButton onClick={() => {
              dispatch(UpdateSidebarType("STARRED"))
            }}>
              <CaretRight />
            </IconButton>
          </Stack>
          <Divider />
          <Stack className='Mute-notification' direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Bell size={21} />
              <Typography variant='subtitle2'>Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack>
          <Divider />
          <Typography variant='caption'>1 group in common</Typography>
          <Stack className='group' direction={"row"} spacing={2} alignItems={"center"}>
            <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
            <Stack spacing={0.5}>
              <Typography variant='subtitle2'>Burger King</Typography>
              <Typography variant='caption'>Alan, Ayush, Codyyy, You </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Button onClick={() => {
              setOpenBlock(true);
            }}
              startIcon={<Prohibit />} fullWidth variant='outlined'>
              Block
            </Button>
            <Button onClick={() => {
              setOpenDelete(true)
            }}
              startIcon={<Trash />} fullWidth variant='outlined'>
              Delete
            </Button>
          </Stack>
        </ScrollableStack>
      </Stack>
      {openBlock && <BlaockDailog open={openBlock} handleClose={handleCloseBlock} />}
      {openDelete && <DeleteDailog open={openDelete} handleClose={handleCloseDelete} />}
    </Box>
  );
};

export default Contact;
