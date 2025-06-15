import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FromProvider';
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { RHFTextFeild } from '../../components/hook-form';
import { useForm } from 'react-hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { useDispatch } from 'react-redux';
import { NewPassword } from '../../redux/slices/auth';
import { useLocation } from 'react-router-dom';




const NewPasswordFrom = () => {
  const dispatch=useDispatch();
  const location=useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const token = new URLSearchParams(location.search).get('code');
  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string().required("Password is required") .matches(
      "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  ),
    passwordConfirm: Yup.string().required("Password is required")
    .oneOf([Yup.ref('password'),null],'Password must match'),
  })
  const defaultValues = {
    password: "Password123!",
    passwordConfirm:"Password123!"
  }

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSucessful }
  } = methods;

  const onSubmit = async (date) => {
    try {
      //submit data to backend
      dispatch(NewPassword(date,token));
    } catch (error) {
      console.log(error);
      reset()
      setError("afterSubmit", {
        ...error,
        message: error.message,
      })
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack className='form' spacing={3} >
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
        <RHFTextFeild name="password" label=" New Password" type={showPassword ? "text" : "password"} InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton onClick={() => {
                setShowPassword(!showPassword);
              }}>
                {showPassword ? <Eye /> : <EyeSlash />}
              </IconButton>
            </InputAdornment>
          )
        }} />
         <RHFTextFeild name="passwordConfirm" label=" Confirm Password" type={showPassword ? "text" : "password"} InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton onClick={() => {
                setShowPassword(!showPassword);
              }}>
                {showPassword ? <Eye /> : <EyeSlash />}
              </IconButton>
            </InputAdornment>
          )
        }} />
        <Button
        fullWidth
        color='inherit'
        size='large'
        type='submit'
        variant='contained'
        sx=
        {{
          backgroundColor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light"
              ? "common.white" : "grey.800",
          '&:hover': {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light"
                ? "common.white" : "grey.800",
          }
        }}>
        Submit
      </Button>
      </Stack>
    </FormProvider>
  )
}

export default NewPasswordFrom;
