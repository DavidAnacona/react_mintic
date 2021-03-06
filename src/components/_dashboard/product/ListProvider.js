import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({ formik }) {
  const [provider, setProvider] = useState([]);

  useEffect(() => {
    const providers = () => {
      const requestOptions = {
        method: 'GET'
      };

      fetch('https://ciclo3-mintic-back.herokuapp.com/proveedores/listar/', requestOptions)
        .then((res) => res.json())
        .then((result) =>
          setProvider(
            result.map((i) => ({
              name: i?.nombre_proveedor,
              id: i?.nitproveedor
            }))
          )
        )
        .catch((error) => console.log('error', error));
    };
    providers();
  }, []);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formik?.value?.nitproveedor}
          label="Proveedor"
          onChange={formik?.handleChange}
          name="nitproveedor"
        >
          {provider.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
