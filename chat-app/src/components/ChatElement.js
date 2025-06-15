import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { faker } from "@faker-js/faker";
import { useDispatch } from "react-redux";
import { selectConverstion } from "../redux/slices/app";

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};


const ChatElement = ({ id, name, unread, msg, online, time }) => {
    const theme = useTheme();
    const dispatch=useDispatch();
    return (
      <Box
      onClick={()=>{
        dispatch(selectConverstion({room_id:id}));
      }}
        sx={{
          width: "100%",
          borderRadius: 1,
          backgroundColor: theme.palette.mode === 'light' ? "#ffffff" : theme.palette.background.paper,
        }}
        p={2}
      >
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={'space-between'}
        >
          <Stack direction={"row"} spacing={2}>
            {online ? <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} />
            </StyledBadge> : <Avatar src={faker.image.avatar()} />
            }
  
            <Stack spacing={0.3}>
              <Typography variant='subtitle2'>{name}</Typography>
              <Typography variant='caption'>{truncateText(msg, 20)}</Typography>
            </Stack>
  
          </Stack>
          <Stack spacing={2} alignItems={"center"}>
            <Typography sx={{ fontWeight: 600 }} variant='caption'>{time}</Typography>
            <Badge color='primary' badgeContent={unread}></Badge>
          </Stack>
        </Stack>
  
      </Box>
    )
  }
export default ChatElement;  