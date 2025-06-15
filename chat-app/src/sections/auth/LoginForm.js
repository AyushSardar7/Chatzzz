import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FromProvider';
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RHFTextFeild } from '../../components/hook-form';
import { useForm } from 'react-hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { LoginUser } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "demo123@talk.com",
    password: "Password123!",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = methods;

  const onSubmit = async (data) => {
    try {
      //submit data to backend
      dispatch(LoginUser(data));
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack className='form' spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
        <RHFTextFeild name="email" label="Email address" />

        <RHFTextFeild
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end"> 
                <IconButton onClick={() => {
                  setShowPassword(!showPassword);
                }}>
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>
      <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
        <Link component={RouterLink} to="/auth/reset-password" variant='body2' color="inherit" underline='always'>
          Forgot password?
        </Link>
      </Stack>
      <Button
        fullWidth
        color='inherit'
        size='large'
        type='submit'
        variant='contained'
        sx={{
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
        Login
      </Button>
    </FormProvider>
  );
}

export default LoginForm;
