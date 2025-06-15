import React from 'react'
import * as Yup from "yup";
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFTextFeild } from '../../components/hook-form';
import FormProvider from '../../components/hook-form/FromProvider';
import RHFAutoComplete from '../../components/hook-form/RHFAutoComplete';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const MEMBERS=["Name 1","Name 2 ","Name 3"];

const CreateGroupFrom=({handleClose })=>{
    const NewGroupSchema=Yup.object().shape({
        title:Yup.string().required("Title is required"),
        members:Yup.array().min(2,"must have at lesat 2 members")
    })
    const defaultValues={
        title:"",
        members:[],
    }
    const methods=useForm({
        resolver:yupResolver(NewGroupSchema),
        defaultValues
    })
    const {
        reset,
        watch,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSucessful,isValid }
      } = methods;

      const onSubmit=async(date)=>{
        try{
            //Api call
        }catch(err){
            console.log("error",err);
            reset()
            setError("afterSubmit", {
                ...errors,
                message: errors.message,
              })
        }
      };
      return(
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextFeild name="title" label="Title"/>
                <RHFAutoComplete name="members"
                label="Members"
                multiple 
                freeSolo
                options={MEMBERS.map((option)=>option)} 
                ChipProps={{size:"medium"}}/>
                <Stack className='button' spacing={2} direction={"row"} alignItems={"center"} justifyContent={"end"}>
                  <Button onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type='submit' variant='contained'>
                    Create
                  </Button>
                </Stack>
            </Stack>
        </FormProvider>
      )
    
  }
const CreateGroup = ({open,handleClose}) => {
  return (
    <Dialog fullWidth
    maxWidth="xs" 
    open={open} 
    TransitionComponent={Transition}
    keepMounted
    sx={{p:4}}
    >
        {/*Title*/}
        <DialogTitle sx={{mb:3}}>Create New Group</DialogTitle>
        {/*Content*/}
        <DialogContent>
        {/*Form*/}
        <CreateGroupFrom handleClose={handleClose}/>
        </DialogContent>
    </Dialog>
  )
}

export default CreateGroup
