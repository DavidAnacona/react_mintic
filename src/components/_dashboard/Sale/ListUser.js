import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ListUser({ formik }) {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const clients = () => {
      const requestOptions = {
        method: 'GET'
      };

      fetch('https://ciclo3-mintic-back.herokuapp.com/usuarios/listar/', requestOptions)
        .then((res) => res.json())
        .then((result) =>
          setUser(
            result.map((i) => ({
              name: i?.nombre_usuario,
              id: i?.cedula_usuario
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
        <InputLabel id="demo-simple-select-label">Usuario</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formik?.value?.cedula_usuario}
          label="Usuario"
          onChange={formik?.handleChange}
          name="cedula_usuario"
        >
          {user.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
