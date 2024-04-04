import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Typography, TextField, Button, Box } from "@mui/material";
import "./Section.css";
import { useQueryClient } from '@tanstack/react-query'

const Section = ({section, data, hashval, mutation}) => {

  // Access the client
  const queryClient = useQueryClient()

  const {
    register,
    setValue,
    setError,
    handleSubmit,
    clearErrors,
    formState: { dirtyFields, errors },
  } = useForm();
  
  useEffect(() => {
    if ((!dirtyFields.length > 0) && data) {
      setValue('hashval', hashval, { shouldDirty: false });
      for(let field of section.fields) {
        setValue(field.key, data[field.key], { shouldDirty: false });
      }
    }
  }, [data]);

  const refresh = () => {
    clearErrors();
    queryClient.invalidateQueries({ queryKey: ['sections'] });
  }

  const onSubmit = (submitted) => {
    const { hashval } = submitted;
    delete submitted.hashval;

    mutation.mutate({
      column: section.key,
      data: submitted,
      hashval
    }, {
      onError: (err, value) => {
        setError('root.serverError', { 
          type: '400',
          message: `Unable to save your changes. Someone else has edited this section.`
        });
      }
    });

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container">
      <input type="hidden" {...register("hashval")}/>
      <Box
        component="section"
        sx={{
          p: 2,
          border: "1px solid grey",
          borderColor: errors.root?.serverError ? "darkred" : "grey",
          borderRadius: "6px",
          margin: "1em",
        }}
      >
        <Typography variant="h5" gutterBottom>
            {section.title}
        </Typography>

        {errors.root?.serverError && 
        <p className="errors">
          {errors.root.serverError.message}
          <Button onClick={refresh} variant="text">Refresh</Button>
        </p>}      

        {section.fields.map((field,index) => {
            return (
                <TextField
                    key={index}
                    label={field.title}
                    {...register(field.key)}
                    error={!!errors[field.key]}
                    helperText={errors[field.key]?.message}
                    InputLabelProps={{ shrink: true }}
                />
            )
        })}
        
        <Button variant="text" color="primary" type="submit">
          Save
        </Button>
      </Box>
    </form>
  );
};

export default Section;
