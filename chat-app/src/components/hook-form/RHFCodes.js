import { Stack, TextField } from '@mui/material';
import React, { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form';

const RHFCodes = ({ keyName = '', inputs = [], ...other }) => {
    const codeRef = useRef(null);
    const { control } = useFormContext();

    const handleChangeWithNextFeild=(event,handleChange)=>{
        const{maxLength,value,name}=event.target;

        const feildIndex=name.replace(keyName,"");

        const feildIntIndex=Number(feildIndex);

        const nextFeild=document.querySelector(`input[name=${keyName}${feildIntIndex+1}]`);

        if(value.length>maxLength){
            value=value[0];
        }

        if(value.length>=maxLength &&feildIntIndex<6 &&nextFeild !==null){
            nextFeild.focus();
        }
        handleChange(event);
    }
  

    
    return (
        <Stack direction={"row"} spacing={2} justifyContent={"center"} ref={codeRef}>
            {inputs.map((name, index) => (
                <Controller 
                    key={name}
                    name={`${keyName}${index + 1}`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField 
                            {...field} 
                            error={!!error} 
                            autoFocus={index === 0} 
                            placeholder='-' 
                            onChange={(event) => {
                                handleChangeWithNextFeild(event,field.onChange);
                            }}
                            onFocus={(event) => event.currentTarget.select()}
                            InputProps={{
                                sx: {
                                    width: { xs: 36, sm: 56 }, 
                                    height: { xs: 36, sm: 56 }, 
                                    "& input": { p: 0, textAlign: "center" },
                                }
                            }}
                            inputProps={{
                                maxLength: 1,
                                type: "number"
                            }}
                            {...other}
                        />
                    )}
                />
            ))}
        </Stack>
    )
}

export default RHFCodes;
