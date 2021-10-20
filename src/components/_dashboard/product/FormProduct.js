/* eslint-disable react-hooks/rules-of-hooks */
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
import BasicSelect from './ListProvider';

// eslint-disable-next-line react/prop-types
const FormProduct = ({ onClose, open, initialValues, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{initialValues ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Para {initialValues ? ' editar ' : ' agregar '} un producto diligencie todos los campos para
        poder enviar los datos de manera correcta
      </DialogContentText>
      <Formik
        initialValues={
          initialValues || {
            codigo_producto: '',
            nombre_producto: '',
            nitproveedor: '',
            precio_compra: '',
            ivacompra: '',
            precio_venta: ''
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
              <Field as={TextField} fullWidth name="codigo_producto" type="number" label="Codigo" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Nombre producto"
                name="nombre_producto"
              />
              <br />
              <BasicSelect />
              {/* <Field as={TextField} fullWidth type="text" label="Proveedor" name="nitproveedor" /> */}
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Precio compra"
                name="precio_compra"
              />
              <br />
              <Field as={TextField} fullWidth type="text" label="Iva compra" name="ivacompra" />
              <br />
              <Field
                as={TextField}
                fullWidth
                type="text"
                label="Precio venta"
                name="precio_venta"
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

export default FormProduct;
