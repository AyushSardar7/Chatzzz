import { faker } from '@faker-js/faker';
import { Avatar, Box, IconButton, Stack, Typography} from '@mui/material';
import React from 'react'
import StyledBadge from './StyledBadge';
import { ArrowDownLeft, ArrowUpRight, Phone, VideoCamera } from 'phosphor-react';
import { useDispatch } from 'react-redux';
import { styled, useTheme } from "@mui/material/styles";
import { StartAudioCall } from '../redux/slices/audioCall';


const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
    },
  }));

const CallLogElement = ({ online, incoming, missed, id, img, name, }) => {
    return (
        <>
            <StyledChatBox
                sx={{
                    width: "100%",
                    borderRadius: 1,
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? "#ffffff" : theme.palette.background.paper,
                }}
                p={2}
            >
                <Stack
                    direction="row"
                    alignItems={"center"}
                    justifyContent={'space-between'}
                >
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                        {online ? <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                        >
                            <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
                        </StyledBadge> : <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
                        }
                        <Stack spacing={0.3}>
                            <Typography variant='subtitle2' color={missed ? "red" : "main.primany"}>{faker.name.fullName()}</Typography>
                            {/* <Typography variant='caption'>{msg}</Typography> */}
                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                {incoming ?
                                    < ArrowDownLeft color={missed ? "red" : "green"} />
                                    : <ArrowUpRight color={missed ? "red" : "green"} />}
                                <Typography variant='caption'>
                                    Yesterday 21:24
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <IconButton>
                        <Phone color='green' />
                    </IconButton >
                    <IconButton>
                     <VideoCamera color='green' />
                    </IconButton>
                </Stack>
            </StyledChatBox>
        </>
    )
}
const CallElement = ({online,img, name, id, handleClose}) => {
    const dispatch = useDispatch();
  const theme = useTheme();
    return (
        <>
            <StyledChatBox
                sx={{
                    width: "100%",
                    borderRadius: 1,
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? "#ffffff" : theme.palette.background.paper,
                }}
                p={2}
            >
                <Stack
                    direction="row"
                    alignItems={"center"}
                    justifyContent={'space-between'}
                >
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                        {online ? <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={img} />
                        </StyledBadge> :<Avatar alt={name} src={img} />
                        }
                        <Stack spacing={0.3}>
                            <Typography variant='subtitle2'>{name}</Typography>
                            {/* <Typography variant='caption'>{msg}</Typography> */}
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                    <IconButton onClick={()=>{
                        dispatch(StartAudioCall(id));
                        handleClose();
                    }}>
                        <Phone style={{ color: theme.palette.primary.main }} />
                    </IconButton >
                    <IconButton>
                    <VideoCamera style={{ color: theme.palette.primary.main }}/>
                    </IconButton>
                    </Stack> 
                </Stack>
            </StyledChatBox>
        </>
    )

};
export { CallLogElement, CallElement };
