/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import useModal from 'src/utils/hooks/useModal';

// eslint-disable-next-line react/prop-types
export default function DialogSelect({ listProduct, setListProduct, change }) {
  const { isOpen, openModal, closeModal } = useModal();

  const [product, setProduct] = useState([]);

  useEffect(() => {
    const products = () => {
      fetch('https://ciclo3-mintic-back.herokuapp.com/productos/listar/', {
        method: 'GET'
      })
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

  const [product1, setProduct1] = useState({});
  const [value, setValue] = useState('');
  const [cant, setCant] = useState(0);

  const precioTotal = cant * parseInt(product1.value_sale, 10);

  const handleChangeCant = (e) => {
    setCant(e.target.value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    const filterProducts = product.filter((i) => i.id === parseInt(e.target.value, 10));
    setProduct1(filterProducts[0]);
  };

  const addToList = () => {
    setListProduct([...listProduct, { id: product1.id, name: product1.name, cant, precioTotal }]);
    closeModal();
    change();
  };

  const deleteToList = (i) => {
    setListProduct([...listProduct.filter((j) => j.id !== i.id)]);
    change();
  };

  return (
    <div>
      <Button onClick={openModal}>Agregar un producto</Button>
      {listProduct?.map((i, index) => (
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          key={index}
        >
          <h5>
            {i.name}-cantidad: {i.cant}- precioTotal: {i.precioTotal}
          </h5>
          <Button onClick={() => deleteToList(i)}>X</Button>
        </div>
      ))}
      <Dialog disableEscapeKeyDown open={isOpen} onClose={closeModal}>
        <DialogTitle>Escoge tu producto</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Producto</InputLabel>
              <Select
                native
                value={value}
                onChange={handleChange}
                input={<OutlinedInput label="Producto" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                {product.map((i) => (
                  <option value={i.id} key={i?.id}>
                    {i?.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120, display: 'flex', gap: 1 }}>
              <TextField
                value={cant}
                onChange={handleChangeCant}
                fullWidth
                type="number"
                label="Cantidad"
                name="valor_venta"
              />
              <TextField
                disabled
                value={precioTotal}
                fullWidth
                type="number"
                label="Precio total"
                name="Precio_total"
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          <Button onClick={addToList}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
