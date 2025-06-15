import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useTheme ,styled} from '@mui/material/styles';
import React, { useEffect, useState } from 'react'
import StyledBadge from './StyledBadge';
import { socket } from '../socket';
import { Chat } from 'phosphor-react';

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
      cursor: "pointer",
  },
  "& > *:not(style) + *:not(style)": {
      marginTop: 0, 
  },
}));

const UserComponent = ({ firstname, lastname, _id, online, img,friendRequests = [],senderfriendRequest=[] }) => {
    const theme = useTheme();
    const user_id = window.localStorage.getItem("user_id");
    const name = `${firstname} ${lastname}`;
    const [requestSent, setRequestSent] = useState(false); 
  
    useEffect(() => {
      const requestExists = friendRequests.some(request => request.sender.id===_id);
      const senderRequestExists = senderfriendRequest.some(request => request.recipient._id === _id);
      if (requestExists || senderRequestExists) {
        setRequestSent(true);
      }
    }, [friendRequests, senderfriendRequest, _id]);
    
  const handleSendRequest = () => {
      if (!requestSent) {
          socket.emit("friend_request", { to: _id, from: user_id });
          setRequestSent(true);
      }
  }
  
    return (
      <StyledChatBox
        className='userbox'
        sx={{
          width: "100%",
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
        }}
        p={2}
      >
        <Stack
          className='list'
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack className='name' direction={"row"} alignItems={"center"} spacing={2}>
            {online ? (
              <StyledBadge
                overlap='circular'
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant='dot'
              >
                <Avatar alt={name} src={img} />
              </StyledBadge>
            ) : (
              <Avatar alt={name} src={img} />
            )}
            <Stack spacing={0.3}>
              <Typography variant='subtitle2'>{name}</Typography>
            </Stack>
          </Stack>
          <Stack className='button' direction={"row"} spacing={2} alignItems={"center"}>
            <Button
              onClick={handleSendRequest}
              disabled={requestSent}
            >
              {requestSent ? "Send Request" : "Send Request"}
            </Button>
          </Stack>
        </Stack>
      </StyledChatBox>
    );
  };
  

  const FriendRequestComponent = ({ firstname, lastname, _id, online, img, id }) => {
    const theme = useTheme();
    const [requestAccepted, setRequestAccepted] = useState(false);
    const name = `${firstname} ${lastname}`;

    return (
        <StyledChatBox className='userbox'
            sx={{
                width: "100%",
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack className='list'
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Stack className='name' direction={"row"} alignItems={"center"} spacing={2}>
                    {""}
                    {online ? (
                        <StyledBadge
                            overlap='circular'
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            variant='dot'
                        >
                            <Avatar alt={name} src={img} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={img} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant='subtitle2'>{name}</Typography>
                    </Stack>
                </Stack>
                <Stack className='button' direction={"row"} spacing={2} alignItems={"center"}>
                    <Button
                        onClick={() => {
                            socket.emit("accept_request", { request_id: id }, () => {
                                alert("Request accepted");
                                setRequestAccepted(true);
                            });
                        }}
                        disabled={requestAccepted}
                    >
                        {requestAccepted ? "Request Accepted" : "Accept Request"}
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};
const FriendComponent = ({firstname,lastname,_id,online,img}) => {
    const theme=useTheme();
    const user_id = window.localStorage.getItem("user_id");
    const name =`${firstname} ${lastname}`
  return (
    <StyledChatBox className='userbox'
    sx={{
        width:"100%",
        borderRadius:1,
        backgroundColor:theme.palette.background.paper,
    }}
    p={2}
    >
        <Stack className='list'
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        >
            <Stack className='name' direction={"row"} alignItems={"center"} spacing={2}>
                {""}
                {online?(
                    <StyledBadge
                    overlap='circular'
                    anchorOrigin={{vertical:"bottom",horizontal:"right"}}
                    variant='dot'
                    >
                        <Avatar alt={name} src={img}/>
                    </StyledBadge>
                ):(
                    <Avatar alt={name} src={img}/>
                )}
                <Stack spacing={0.3}>
                    <Typography variant='subtitle2'>{name}</Typography>
                </Stack>
            </Stack>
            <Stack className='button' direction={"row"} spacing={2} alignItems={"center"}>
                <IconButton onClick={()=>{
                    //start a new convo
                    socket.emit("start_conversation",{to:_id, from :user_id})
                }}
                >
                    <Chat/>
                </IconButton>
            </Stack>
        </Stack>
    </StyledChatBox>
  )
}


export {UserComponent,FriendRequestComponent,FriendComponent};
