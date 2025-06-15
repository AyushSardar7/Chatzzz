import React from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FromProvider';
import { Alert, Button, Stack } from '@mui/material';
import { RHFTextFeild } from '../../components/hook-form';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ForgotPassword } from '../../redux/slices/auth';


const ResetPasswordForm = () => {
  const dispatch=useDispatch();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email must be a valid emial address"),
    
  })
  const defaultValues = {
    email: "demo123@talk.com",
  }

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
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
      dispatch(ForgotPassword(date));
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
        <RHFTextFeild name="email" label="Email address" />
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
        Send Request
      </Button>
      </Stack>
    </FormProvider>
  )
}
export default ResetPasswordForm;