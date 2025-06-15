import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FromProvider';
import { Alert, Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { Eye, EyeSlash } from 'phosphor-react';
import RHFTextField from '../../components/hook-form/RHFTextFeild';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string().required("Email is required").email("Email must be a valid email address"),
    password: Yup.string().required("Password is required").matches(
      "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  });

  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "demo123@talk.com",
    password: "Password123!",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log('Submitting form:', data);
      await dispatch(RegisterUser(data, navigate));
    } catch (error) {
      console.error('Error during form submission:', error);
      reset();
      setError("afterSubmit", {
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack className='register-form' spacing={3}>
        {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
        <Stack className='name' direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="firstname" label="First Name" /> 
          <RHFTextField name="lastname" label="Last Name" /> 
        </Stack>
        <RHFTextField name="email" label="Email" /> 
        <RHFTextField name="password" label="Password" type={showPassword ? "text" : "password"} InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye /> : <EyeSlash />}
              </IconButton>
            </InputAdornment>
          )
        }} />
      </Stack>
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
          },
        mt:3
        }}>
        Create account
      </Button>
    </FormProvider>
  );
};

export default RegisterForm;
