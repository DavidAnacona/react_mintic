/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';

// components
import { useSnackbar } from 'notistack';
import FormUser from '../components/_dashboard/user/FormUser';
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
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [usuarios, setUsuarios] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

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

  // Modals
  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const [editData, setEditData] = useState([]);

  // CRUD methods
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const handleCreateUser = async (values) => {
    const raw = JSON.stringify({
      ...values
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const res = await fetch(
        'https://ciclo3-mintic-back.herokuapp.com/usuarios/guardar/',
        requestOptions
      );
      const data = await res.json();

      if (data.mensaje === 'Ya existe un usuario con la cedula ingresada') {
        enqueueSnackbar(data.mensaje, {
          variant: 'error'
        });
        handleCloseCreate();
      } else {
        setUsuarios([...usuarios, values]);
        handleCloseCreate();
        enqueueSnackbar(data.mensaje, {
          variant: 'success'
        });
      }
    } catch (err) {
      enqueueSnackbar('Usuario NO creado', {
        variant: 'error'
      });
      console.log('error', err);
    }
  };
  const handleEditUser = (values) => {
    const raw = JSON.stringify({
      ...values
    });

    const requestOptions = {
      headers: myHeaders,
      method: 'PUT',
      body: raw,
      redirect: 'follow'
    };

    fetch(
      `https://ciclo3-mintic-back.herokuapp.com/usuarios/actualizar/${values?.cedula_usuario}`,
      requestOptions
    )
      .then((response) => response.text())
      .then(() => {
        enqueueSnackbar('Usuario editado con exito', {
          variant: 'success'
        });
        setUsuarios([
          ...usuarios.filter((i) => i.cedula_usuario !== values.cedula_usuario),
          values
        ]);
        handleCloseEdit();
      })
      .catch((error) => {
        enqueueSnackbar('Usuario NO editado', {
          variant: 'error'
        });
        console.log('error', error);
      });
  };
  const handleDetailUser = (cedula_usuario) => {
    const requestOptions = {
      method: 'GET'
    };
    fetch(
      `https://ciclo3-mintic-back.herokuapp.com/usuarios/detalle/${cedula_usuario}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        setEditData(res);
        handleOpenEdit();
      })
      .catch((err) => {
        enqueueSnackbar('NO se puede listar informacion del usuario', {
          variant: 'error'
        });
        console.log(err);
      });
  };
  const handleDeleteUser = (cedula_usuario) => {
    const requestOptions = {
      method: 'DELETE'
    };
    fetch(
      `https://ciclo3-mintic-back.herokuapp.com/usuarios/eliminar/${cedula_usuario}`,
      requestOptions
    )
      .then((res) => res.text())
      .then(() => {
        enqueueSnackbar('Usuario eliminado con exito', {
          variant: 'success'
        });
        setUsuarios(usuarios.filter((i) => i.cedula_usuario !== cedula_usuario));
      })
      .catch((err) => {
        enqueueSnackbar('Usuario NO eliminado', {
          variant: 'error'
        });
        console.log(err);
      });
  };

  return (
    <Page title="Usuarios | Proyecto MinTic">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lista de Usuarios
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenCreate}
            startIcon={<Icon icon={plusFill} />}
          >
            Crear usuarios
          </Button>
          <FormUser open={openCreate} onClose={handleCloseCreate} onSubmit={handleCreateUser} />
        </Stack>
        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={usuarios.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { nombre_usuario, email_usuario, password, usuario, cedula_usuario } =
                        row;

                      return (
                        <TableRow hover key={index} tabIndex={-1}>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2} mx={2}>
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
                            <FormUser
                              open={openEdit}
                              onClose={handleCloseEdit}
                              onSubmit={handleEditUser}
                              initialValues={editData}
                            />
                            <UserMoreMenu
                              onEdit={() => handleDetailUser(cedula_usuario)}
                              onDelete={() => handleDeleteUser(cedula_usuario)}
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
