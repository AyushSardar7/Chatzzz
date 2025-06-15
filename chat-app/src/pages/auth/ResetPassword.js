import { Link, Stack, Typography } from '@mui/material'
import { CaretLeft } from 'phosphor-react';
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import ResetPasswordForm from '../../sections/auth/ResetPasswordFrom';

const ResetPAssword = () => {
  return (
    <>
    <Stack className='reset' spacing={2} sx={{mb:5,position:"relative" }}>
        <Typography variant='h3' paragraph>
            Forgot your Password?
        </Typography>
        <Typography sx={{color:"text.secondary",mb:5}}>
            Please enter the email address associated 
            with your account and We will email you the link 
            to reset your password.
        </Typography>
        {/*Reset Password Form*/}
        <ResetPasswordForm/>
        <Link
         component={RouterLink} 
        to="/auth/login" 
        color="inherit" 
        variant='subtitle2' 
        sx={{
          mt:3, 
          mx:"auto",
          alignItems:"center", 
          display:"inline"
          }}>
          <CaretLeft/>Return to Sign in
        </Link>
    </Stack>
      
    </>
  )
}

export default ResetPAssword
