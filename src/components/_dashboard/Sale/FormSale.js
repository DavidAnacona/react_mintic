import React, { useState } from 'react';
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
import { parse } from '@babel/core';
import ListClient from './ListClient';
import ListUser from './ListUser';
import DialogSelect from './FormProduct';

// eslint-disable-next-line react/prop-types
const FormProvider = ({ onClose, open, initialValues, onSubmit }) => {
  const [listProduct, setListProduct] = useState([]);

  const total = listProduct.reduce((sum, value) => sum + value.precioTotal, 0);

  const cancel = (resetForm) => {
    onClose();
    resetForm();
  };
  return (
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
              total_venta: ''
            }
          }
          onSubmit={(values, { resetForm }) => {
            resetForm();
            onSubmit(values, total, listProduct);
            console.log(values);
          }}
        >
          {({ submitForm, isSubmitting, resetForm, ...formik }) => (
            <Form onSubmit={submitForm}>
              <Stack mt={2}>
                <Field as={TextField} fullWidth name="codigo_venta" type="number" label="Codigo" />
                <br />
                <ListClient formik={formik} />
                <br />
                <ListUser formik={formik} />
                <br />
                <DialogSelect listProduct={listProduct} setListProduct={setListProduct} />
                <br />
                <Field
                  as={TextField}
                  fullWidth
                  value={total}
                  name="total_venta"
                  type="number"
                  label="Total venta"
                  disabled
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
                  onClick={() => cancel(resetForm)}
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
};

export default FormProvider;
