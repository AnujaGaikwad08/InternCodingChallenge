import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import api from '../utils/api';
import { setToken, setUser } from '../utils/auth';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            const res = await api.post('/auth/login', values);
            setToken(res.data.token);
            setUser(res.data.user);
            if (res.data.user.role === 'admin') navigate('/admin');
            else if (res.data.user.role === 'user') navigate('/user');
            else if (res.data.user.role === 'owner') navigate('/owner');
          } catch (err) {
            setFieldError('email', err.response?.data?.message || 'Login failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
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
              name="password"
              type="password"
              label="Password"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginPage; 