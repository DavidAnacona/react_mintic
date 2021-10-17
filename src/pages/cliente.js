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
  { id: 'name', label: 'Nombre usuario', alignRight: false },
  { id: 'document', label: 'Cedula', alignRight: false },
  { id: 'email', label: 'Correo', alignRight: false },
  { id: 'user', label: 'Usuario', alignRight: false },
  { id: 'password', label: 'Contraseña', alignRight: false }
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
      (_user) => _user.nombre_usuario.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const users = () => {
      const requestOptions = {
        method: 'GET'
      };

      fetch('https://ciclo3-mintic-back.herokuapp.com/usuarios/listar/', requestOptions)
        .then((res) => res.json())
        .then((result) => setUsuarios(result))
        .catch((error) => console.log('error', error));
    };
    users();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usuarios.map((n) => n.nombre_usuario);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usuarios.length) : 0;

  const filteredUsers = applySortFilter(usuarios, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Page title="Usuarios | Proyecto MinTic">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lista de Usuarios
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            onClick={handleClickOpen}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Crear usuarios
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Usuario</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Para agregar un usuario diligencie todos los campos para poder enviar los datos de
                manera correcta
              </DialogContentText>
              <Formik
                initialValues={{
                  cedula_usuario: '',
                  email_usuario: '',
                  nombre_usuario: '',
                  password: '',
                  usuario: ''
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
                    'https://ciclo3-mintic-back.herokuapp.com/usuarios/guardar/',
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
                        name="cedula_usuario"
                        type="number"
                        label="Cedula"
                      />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="text"
                        label="Nombre usuario"
                        name="nombre_usuario"
                      />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="email"
                        label="Email"
                        name="email_usuario"
                      />
                      <br />
                      <Field as={TextField} fullWidth type="text" label="Usuario" name="usuario" />
                      <br />
                      <Field
                        as={TextField}
                        fullWidth
                        type="password"
                        label="Contraseña"
                        name="password"
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
                  rowCount={usuarios.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { nombre_usuario, email_usuario, password, usuario, cedula_usuario } =
                        row;
                      const isItemSelected = selected.indexOf(nombre_usuario) !== -1;

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
                              onChange={(event) => handleClick(event, nombre_usuario)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar
                                alt={nombre_usuario}
                                src="https://randomuser.me/api/portraits/women/28.jpg"
                              />
                              <Typography variant="subtitle2" noWrap>
                                {nombre_usuario}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{cedula_usuario}</TableCell>
                          <TableCell align="left">{email_usuario}</TableCell>
                          <TableCell align="left">{usuario}</TableCell>
                          <TableCell align="left">{password}</TableCell>
                          <TableCell align="right">
                            <UserMoreMenu
                              onEdit={() => alert(cedula_usuario)}
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
                                  `https://ciclo3-mintic-back.herokuapp.com/usuarios/eliminar/${cedula_usuario}`,
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
                {isUserNotFound && (
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
            count={usuarios.length}
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
