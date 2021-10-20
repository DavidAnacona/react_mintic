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
const FormProvider = ({ onClose, open, initialValues, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{initialValues ? 'Editar Proveedor' : 'Agregar Proveedor'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Para {initialValues ? ' editar ' : ' agregar '} un proveedor diligencie todos los campos
        para poder enviar los datos de manera correcta
      </DialogContentText>
      <Formik
        initialValues={
          initialValues || {
            nitproveedor: '',
            nombre_proveedor: '',
            ciudad_proveedor: '',
            direccion_proveedor: '',
            telefono_proveedor: ''
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
              <Field as={TextField} fullWidth name="nitproveedor" type="number" label="Nit" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Nombre proveedor"
                name="nombre_proveedor"
              />
              <br />
              <Field as={TextField} fullWidth type="text" label="Ciudad" name="ciudad_proveedor" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Direccion"
                name="direccion_proveedor"
              />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Telefono"
                name="telefono_proveedor"
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

export default FormProvider;
