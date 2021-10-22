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
import ListClient from './ListClient';
import ListUser from './ListUser';
import DialogSelect from './FormProduct';
// eslint-disable-next-line react/prop-types
const FormProvider = ({ onClose, open, initialValues, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{initialValues ? 'Editar Venta' : 'Agregar Venta'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Para {initialValues ? ' editar ' : ' agregar '} una venta diligencie todos los campos para
        poder enviar los datos de manera correcta
      </DialogContentText>
      <Formik
        initialValues={
          initialValues || {
            codigo_venta: '',
            cedula_cliente: '',
            cedula_usuario: '',
            valor_venta: '',
            ivaventa: '',
            total_venta: ''
          }
        }
        onSubmit={(values, { resetForm }) => {
          resetForm();
          onSubmit(values);
        }}
      >
        {({ submitForm, isSubmitting, resetForm, ...formik }) => (
          <Form>
            <Stack mt={2}>
              <Field as={TextField} fullWidth name="codigo_venta" type="number" label="Codigo" />
              <br />
              <ListClient formik={formik} />
              <br />
              <ListUser formik={formik} />
              <br />
              <DialogSelect formik={formik} />
              <br />
              <Field as={TextField} fullWidth type="text" label="Valor venta" name="valor_venta" />
              <br />
              <Field as={TextField} fullWidth type="text" label="Total venta" name="total_venta" />
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
