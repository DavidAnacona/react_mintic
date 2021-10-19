/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  TextField
} from '@mui/material';
// components
import { Formik, Form, Field } from 'formik';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre cliente', alignRight: false },
  { id: 'document', label: 'Cedula', alignRight: false },
  { id: 'email', label: 'Correo', alignRight: false },
  { id: 'address', label: 'Dirección', alignRight: false },
  { id: 'phone', label: 'Teléfono', alignRight: false }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_client) => _client.nombre_cliente.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Client() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const clients = () => {
      const requestOptions = {
        method: 'GET'
      };

      fetch('https://ciclo3-mintic-back.herokuapp.com/clientes/listar', requestOptions)
        .then((res) => res.json())
        .then((result) => setClientes(result))
        .catch((error) => console.log('error', error));
    };
    clients();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = clientes.map((n) => n.nombre_cliente);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clientes.length) : 0;

  const filteredClients = applySortFilter(clientes, getComparator(order, orderBy), filterName);

  const isClientNotFound = filteredClients.length === 0;

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Page title="Clientes | Proyecto MinTic">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lista de Clientes
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            onClick={handleClickOpen}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Crear cliente
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar cliente</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Para agregar un cliente diligencie todos los campos para poder enviar los datos de
                manera correcta
              </DialogContentText>
              <Formik
                initialValues={{
                  cedula_cliente: '',
                  email_cliente: '',
                  nombre_cliente: '',
                  direccion_cliente: '',
                  telefono_cliente: ''
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const myHeaders = new Headers();
                  myHeaders.append('Content-Type', 'application/json');

                  const raw = JSON.stringify({
                    ...values
                  });

                  const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                  };

                  fetch(
                    'https://ciclo3-mintic-back.herokuapp.com/clientes/guardar/',
                    requestOptions
                  )
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.log('error', error));
                }}
              >
                {({ submitForm, isSubmitting }) => (
                  <Form>
                    <Stack mt={2}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="cedula_cliente"
                        type="number"
                        label="Cedula"
                      />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="text"
                        label="Nombre cliente"
                        name="nombre_cliente"
                      />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="email"
                        label="Email"
                        name="email_cliente"
                      />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="text"
                        label="Dirección"
                        name="direccion_cliente"
                      />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="text"
                        label="Teléfono"
                        name="telefono_cliente"
                      />
                    </Stack>
                    <Stack gap={2} mt={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={submitForm}
                      >
                        Agregar
                      </Button>
                      <Button fullWidth variant="contained" color="error" onClick={handleClose}>
                        Cancelar
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={clientes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredClients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        nombre_cliente,
                        email_cliente,
                        telefono_cliente,
                        direccion_cliente,
                        cedula_cliente
                      } = row;
                      const isItemSelected = selected.indexOf(nombre_cliente) !== -1;

                      return (
                        <TableRow
                          hover
                          key={index}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, nombre_cliente)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar
                                alt={nombre_cliente}
                                src="https://randomuser.me/api/portraits/men/20.jpg"
                              />
                              <Typography variant="subtitle2" noWrap>
                                {nombre_cliente}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{cedula_cliente}</TableCell>
                          <TableCell align="left">{email_cliente}</TableCell>
                          <TableCell align="left">{telefono_cliente}</TableCell>
                          <TableCell align="left">{direccion_cliente}</TableCell>
                          <TableCell align="right">
                            <UserMoreMenu
                              onEdit={() => alert(cedula_cliente)}
                              onDelete={() => {
                                const headers = new Headers();

                                headers.append('Content-Type', 'application/json');
                                headers.append('Accept', 'application/json');

                                headers.append('Origin', 'http://localhost:3000');
                                const requestOptions = {
                                  method: 'DELETE',
                                  headers: Headers
                                };
                                fetch(
                                  `https://ciclo3-mintic-back.herokuapp.com/clientes/eliminar/${cedula_cliente}`,
                                  requestOptions
                                )
                                  .then((res) => res.text())
                                  .then((res) => console.log(res))
                                  .catch((err) => console.log(err));
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isClientNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={clientes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
