import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import api from '../utils/api';

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(20, 'Min 20 chars').max(60, 'Max 60 chars').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  address: Yup.string().max(400, 'Max 400 chars'),
  password: Yup.string()
    .min(8, 'Min 8 chars')
    .max(16, 'Max 16 chars')
    .matches(/[A-Z]/, '1 uppercase required')
    .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, '1 special char required')
    .required('Required'),
  role: Yup.string().oneOf(['user', 'owner'], 'Select a role').required('Required'),
});

const SignupPage = () => {
  const navigate = useNavigate();
  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ name: '', email: '', address: '', password: '', role: '' }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await api.post('/auth/signup', values);
            navigate('/login');
          } catch (err) {
            setFieldError('email', err.response?.data?.message || 'Signup failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              component={TextField}
              name="name"
              label="Name"
              fullWidth
              margin="normal"
            />
            <Field
              component={TextField}
              name="email"
              type="email"
              label="Email"
              fullWidth
              margin="normal"
            />
            <Field
              component={TextField}
              name="address"
              label="Address"
              fullWidth
              margin="normal"
            />
            <Field
              component={TextField}
              name="password"
              type="password"
              label="Password"
              fullWidth
              margin="normal"
            />
            <Field
              component={TextField}
              name="role"
              label="Role"
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="owner">Store Owner</MenuItem>
            </Field>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignupPage; 