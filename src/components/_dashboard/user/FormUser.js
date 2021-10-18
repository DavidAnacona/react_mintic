import React from 'react';
import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  TextField
} from '@mui/material';
// components
import { Formik, Form, Field } from 'formik';

// eslint-disable-next-line react/prop-types
const FormUser = ({ onClose, open, initialValues, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{initialValues ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Para {initialValues ? ' editar ' : ' agregar '} un usuario diligencie todos los campos para
        poder enviar los datos de manera correcta
      </DialogContentText>
      <Formik
        initialValues={
          initialValues || {
            cedula_usuario: '',
            email_usuario: '',
            nombre_usuario: '',
            password: '',
            usuario: ''
          }
        }
        onSubmit={(values, { resetForm }) => {
          resetForm();
          onSubmit(values);
        }}
      >
        {({ submitForm, isSubmitting, resetForm }) => (
          <Form>
            <Stack mt={2}>
              <Field as={TextField} fullWidth name="cedula_usuario" type="number" label="Cedula" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Nombre usuario"
                name="nombre_usuario"
              />
              <br />
              <Field as={TextField} fullWidth type="email" label="Email" name="email_usuario" />
              <br />
              <Field as={TextField} fullWidth type="text" label="Usuario" name="usuario" />
              <br />
              <Field as={TextField} fullWidth type="password" label="Contraseña" name="password" />
            </Stack>
            <Stack gap={2} mt={3}>
              <Button fullWidth variant="contained" disabled={isSubmitting} onClick={submitForm}>
                {initialValues ? 'Editar' : 'Agregar'}
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
              >
                Cancelar
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </DialogContent>
  </Dialog>
);

export default FormUser;
