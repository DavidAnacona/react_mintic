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
const FormClient = ({ onClose, open, initialValues, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{initialValues ? 'Editar cliente' : 'Agregar Cliente'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Para {initialValues ? ' editar ' : ' agregar '} un cliente diligencie todos los campos para
        poder enviar los datos de manera correcta
      </DialogContentText>
      <Formik
        initialValues={
          initialValues || {
            cedula_cliente: '',
            email_cliente: '',
            nombre_cliente: '',
            direccion_cliente: '',
            telefono_cliente: ''
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
              <Field as={TextField} fullWidth name="cedula_cliente" type="number" label="Cedula" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Nombre cliente"
                name="nombre_cliente"
              />
              <br />
              <Field as={TextField} fullWidth type="email" label="Email" name="email_cliente" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Direccion"
                name="direccion_cliente"
              />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Telefono"
                name="telefono_cliente"
              />
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

export default FormClient;
