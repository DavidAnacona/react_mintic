import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
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

  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Proveedor"
          onChange={handleChange}
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
