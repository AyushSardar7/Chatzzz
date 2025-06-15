import { Stack, Typography ,Link} from '@mui/material'
import React from 'react'
import{Link as RouterLink} from "react-router-dom";
import AuthSocial from '../../sections/auth/AuthSocial';
import LoginForm from '../../sections/auth/LoginForm';

const Login = () => {
  return (
    <>
    <Stack className='login' spacing={2} sx={{mb:5, position:"relative"}}>
        <Typography variant='h5'> Login to Talkkkk</Typography>
        <Stack className='link' direction={"row"} spacing={0.5}>
            <Typography variant='body2'>New User</Typography>
            <Link to="/auth/register" component={RouterLink} variant='body2'>
                Create a acount
            </Link>
        </Stack>
        {/*Login From*/}
        <LoginForm/>
        {/*Auth Social*/}
        <AuthSocial/>
    </Stack>
    </>
  )
}

export default Login
