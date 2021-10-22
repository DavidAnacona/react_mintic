import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ListClient({ formik }) {
  const [client, setClient] = useState([]);

  useEffect(() => {
    const clients = () => {
      const requestOptions = {
        method: 'GET'
      };

      fetch('https://ciclo3-mintic-back.herokuapp.com/clientes/listar/', requestOptions)
        .then((res) => res.json())
        .then((result) =>
          setClient(
            result.map((i) => ({
              name: i?.nombre_cliente,
              id: i?.cedula_cliente
            }))
          )
        )
        .catch((error) => console.log('error', error));
    };
    clients();
  }, []);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formik?.value?.cedula_cliente}
          label="Cliente"
          onChange={formik?.handleChange}
          name="cedula_cliente"
        >
          {client.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
