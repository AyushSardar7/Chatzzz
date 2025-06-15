import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FromProvider';
import { Alert, Button, Stack } from '@mui/material';
import { RHFTextFeild } from '../../components/hook-form';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateUserProfile } from '../../redux/slices/app';
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";
import { RHFUploadAvatar } from '../../components/hook-form/RHFUpload';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const { user } = useSelector((state) => state.app);

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    about: Yup.string().required("About is required"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
  });

  const defaultValues = {
    name: `${user?.firstname} ${user?.lastname}`,
    about: user?.about,
    avatar: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      setValue("avatarUrl", newFile, { shouldValidate: true });
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const [firstname, ...rest] = data.name.split(" ");
      const lastname = rest.join(" ");

      dispatch(
        UpdateUserProfile({
          firstname,
          lastname,
          about: data.about,
        })
      );
    } catch (error) {
      console.log(error);
      reset();
      methods.setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack className='form' spacing={3}>
        <Stack className='form-textfeild' spacing={3}>
          {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
          <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />
          <RHFTextFeild name="name" label="Name" helperText={"This name is visible to your contacts"} />
          <RHFTextFeild multiline minRows={3} maxRows={5} name="about" label="About" />
        </Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          <Button color='primary' size='large' type='submit' variant='outlined'>Save</Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
