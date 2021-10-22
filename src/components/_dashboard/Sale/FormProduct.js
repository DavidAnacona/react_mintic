import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { Field } from 'formik';

export default function DialogSelect({ formik }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const products = () => {
      const requestOption = {
        method: 'GET'
      };

      fetch('https://ciclo3-mintic-back.herokuapp.com/productos/listar/', requestOption)
        .then((res) =>
          res.json().then((result) =>
            setProduct(
              result.map((i) => ({
                name: i?.nombre_producto,
                id: i?.codigo_producto,
                value_sale: i?.precio_venta
              }))
            )
          )
        )
        .catch((error) => console.log('error', error));
    };
    products();
  }, []);
  return (
    <div>
      <Button onClick={handleClickOpen}>Agregar un producto</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Escoge tu producto</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Producto</InputLabel>
              <Select
                native
                value={formik?.value?.codigo_producto}
                onChange={formik?.handleChange}
                input={<OutlinedInput label="Producto" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                {product.map((i) => (
                  <option value={i?.id} key={i?.id}>
                    {i?.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Field as={TextField} fullWidth type="number" label="Cantidad" name="valor_venta" />
              <Field
                as={TextField}
                fullWidth
                type="number"
                label="Valor productos"
                name="valor_producto"
                disabled
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
