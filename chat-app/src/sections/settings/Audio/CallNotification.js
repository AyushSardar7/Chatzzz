import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../../socket';
import { ResetAudioCallQueue, UpdateAudioCallDialog } from '../../../redux/slices/audioCall';
import { Avatar, Button, Dialog, DialogActions, DialogContent, Slide, Stack } from '@mui/material';
import { faker } from '@faker-js/faker';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CallNotification = ({ open}) => {
    const dispatch=useDispatch();
    const {user}=useSelector((state)=>state.app);
    const [call_details] = useSelector((state) => state.audioCall.call_queue);
    console.log("UserID:", call_details.userID);
    const handleAccept=()=>{
        socket.emit("audio_call_accepted",{...call_details});
        dispatch(UpdateAudioCallDialog({state:true}))
    }
    const handleDeny = () => {
        socket.emit("audio_call_denied", { ...call_details});
        dispatch(ResetAudioCallQueue());
    };


  if (!call_details) {
    return null; // If no call details are present, render nothing
  }

  return (
    <>
      <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleDeny}
      aria-describedby='alert-dialog-slide-description'
      >
        <DialogContent>
            <Stack direction={"row"} spacing={24} p={2}>
                <Stack>
                    <Avatar
                    sx={{ height: 100, width: 100 }}
                    //  src={`https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${call_details?.from_user?.avatar}`}
                    src={faker.image.avatar()}
                    />
                </Stack>
                <Stack>
                    <Avatar
                    sx={{ height: 100, width: 100 }}
                    //  src={`https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`}
                    src={faker.image.avatar()}
                    />
                </Stack>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleAccept} variant="contained" color="success">
                Accept
            </Button>
            <Button onClick={handleDeny} variant="contained" color="error">
                Deny
            </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CallNotification;
