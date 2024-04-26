import React, { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField, // Import TextField from Material-UI
  } from "@mui/material";
  



const Users = ({serverAPI,formatDateTime,CookieUserId,CookieUserName,CookieUserRole,CookieUserEmail,CookieId}) => {
    const [openAddModal, setOpenAddModal] = useState(false);
    const handleAddUser = () => {
        setOpenAddModal(true);
    }
    const handleCloseUser =() => {
        setOpenAddModal(false);
        handleClear();
    }


    const [openEditModal,setOpenEditModal] = useState(false);
    const [userData, setUserData] = useState({
        userName: '',
        userPhoneNumber: '',
        userEmail: '',
        userAddress: '',
        userPassword: '',
        userRole: 'Admin' // Default role
    });
    const handleOpenEdit = async(id) => {
        setOpenEditModal(true);
        try {
            const response = await axios.get(`${serverAPI}/api/usersById/${id}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
        console.log(id)

    }
    const handleCloseEdit = () => {
        setOpenEditModal(false);
    }


    const [userName, setUserName] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userRole, setUserRole] = useState('Admin');
    const [users, setUsers] = useState([]);
    const [loadingState, setLoadingState] = useState({});
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${serverAPI}/api/users`);
                setUsers(response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []); 

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${serverAPI}/api/users`, {
                userName,
                userPhoneNumber,
                userEmail,
                userAddress,
                userPassword,
                userRole
            });
            setUsers([...users,response.data])
            handleCloseUser();
            handleClear();
            console.log('User added successfully:', response.data);
            // Optionally, you can handle success here, such as showing a success message
        } catch (error) {
            console.error('Error adding user:', error);
            // Optionally, you can handle errors here, such as showing an error message
        }
    };

    const handleUpdateArchive = async(id,arch) => {
        setLoadingState((prevState) => ({
            ...prevState,
            [id]: true // Set loading state to true for the clicked button
        }));
        try {
            await axios.put(`${serverAPI}/api/users/${id}/${arch}`);
            const response = await axios.get(`${serverAPI}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingState((prevState) => ({
                ...prevState,
                [id]: false // Set loading state back to false after the update operation
            }));
        }
    }


    const handleClear = () => {
            setUserName('');
            setUserPhoneNumber('');
            setUserEmail('');
            setUserAddress('');
            setUserPassword('');
            setUserRole('Admin');
    }

    const handleUpdateSubmit = async() => {
        console.log('Updated user data:', userData);
        try {
            const response = await axios.put(`${serverAPI}/api/usersUpdateAll/${userData._id}`, userData);
            console.log('User updated successfully:', response.data);
            handleCloseEdit();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }
    
  return (
    <div>
         <Typography sx={{ fontSize: 28 }}>Users</Typography>
         <div className="flex space-between mt-1">
        <TextField
          sx={{ minWidth: 400 }}
          type="text"
          
          placeholder="Search Users"
          size="small"
        />
        <div className="flex g2">
          {/* <Button variant="outlined" color="success">Inventory Logs</Button> */}

          <Button color="success" variant="contained" onClick={handleAddUser}>
            Add Users
          </Button>
        </div>
      </div>
      <TableContainer sx={{marginTop:4,borderRadius:4}} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell align="">User ID</TableCell>
            <TableCell align="">User Phone</TableCell>
            <TableCell align="">User Email</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="right">Create Date</TableCell>

            <TableCell align=""></TableCell>
            <TableCell align=""></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            
            >
              <TableCell component="th" scope="row" >
                {row.userName}
              </TableCell>
              <TableCell align="">{row.userId}</TableCell>
              <TableCell align="">{row.userPhoneNumber}</TableCell>
              <TableCell align="">{row.userEmail}</TableCell>
              <TableCell align="center">
              {row.userRole === 'Admin' && (
                                <Chip label="Admin" color="success" sx={{minWidth:120}} />
                            )}
                            {row.userRole === 'Service' && (
                                <Chip label="Service" color="primary" sx={{minWidth:120}}  />
                            )}
                            {row.userRole === 'Inventory' && (
                                <Chip label="Inventory" color="info" sx={{minWidth:120}}  />
                            )}
                            {row.userRole === 'Managing Staff' && (
                                <Chip label="Managing Staff" color="warning" sx={{minWidth:120}}  />
                            )}
                            {row.userRole === 'Technician' && (
                                <Chip label="Technician" color="secondary" sx={{minWidth:120}}  />
                            )}
              </TableCell>
              <TableCell align="right">{formatDateTime(row.createdAt)}</TableCell>
              <TableCell align="right">
                
              {row.userArchive === '1' &&  (
                    <EditIcon className="c-pointer" onClick={() => handleOpenEdit(row._id)} />
                )}
                </TableCell>
              <TableCell align="right">
                
                <Button variant="outlined" color="primary">Details</Button>
                </TableCell>
                {/* &nbsp;&nbsp; */}
                <TableCell align="left">
                {row.userArchive === '1' ? (
                   <Button
                   variant="outlined"
                   color="error"
                   onClick={() => handleUpdateArchive(row._id, 0)}
                   sx={{ minWidth: 105 }}
                   disabled={loadingState[row._id]} // Disable the button when loading is true
               >
                   {loadingState[row._id] ? (
                        <CircularProgress size={25} color="error" />
                    ) : (
                        'Block'
                    )}
               </Button>
                ) : (
                    <Button variant="outlined" color="success" onClick={() => handleUpdateArchive(row._id,1)} sx={{minWidth:105}}  disabled={loadingState[row._id]}>
                          {loadingState[row._id] ? (
                        <CircularProgress size={25} color="success" />
                    ) : (
                        'Unblock'
                    )}
                    </Button>
                )}
                                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog open={openAddModal} onClose={handleCloseUser} fullWidth>
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
          <TextField
                sx={{ marginTop: 2 }}
                label="Name"
                type="text"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
                sx={{ marginTop: 2 }}
                label="Phone Number"
                type="number"
                fullWidth
                value={userPhoneNumber}
                onChange={(e) => setUserPhoneNumber(e.target.value)}
            />
            <TextField
                sx={{ marginTop: 2 }}
                label="Email Address"
                type="email"
                fullWidth
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
            <TextField
                sx={{ marginTop: 2 }}
                label="Enter Password"
                type="text"
                fullWidth
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
            />
            <TextField
                sx={{ marginTop: 2 }}
                id="outlined-multiline-static"
                label="Address"
                multiline
                rows={3}
                fullWidth
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
            />
               <FormControl sx={{ marginTop: 2 }}>
                <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Admin"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                >
                    <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="Service" control={<Radio />} label="Service" />
                    <FormControlLabel value="Inventory" control={<Radio />} label="Inventory" />
                    <FormControlLabel value="Managing Staff" control={<Radio />} label="Managing Staff" />
                    <FormControlLabel value="Technician" control={<Radio />} label="Technician" />
                </RadioGroup>
            </FormControl>
          
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUser} >
              Cancel
            </Button>
            <Button color="success" onClick={handleSubmit}>
                Add user
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog open={openEditModal} onClose={handleCloseEdit} fullWidth>
          <DialogTitle>Update User</DialogTitle>
          <DialogContent>
          <TextField
                        sx={{ marginTop: 2 }}
                        label="Name"
                        type="text"
                        fullWidth
                        value={userData.userName}
                        onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
                    />
                    <TextField
                        sx={{ marginTop: 2 }}
                        label="Phone Number"
                        type="number"
                        fullWidth
                        value={userData.userPhoneNumber}
                        onChange={(e) => setUserData({ ...userData, userPhoneNumber: e.target.value })}
                    />
            <TextField
                sx={{ marginTop: 2 }}
                label="Email Address"
                type="email"
                fullWidth
                value={userData.userEmail}
                        onChange={(e) => setUserData({ ...userData, userEmail: e.target.value })}
            />
            <TextField
                sx={{ marginTop: 2 }}
                label="Enter Password"
                type="text"
                fullWidth
                value={userData.userPassword}
                        onChange={(e) => setUserData({ ...userData, userPassword: e.target.value })}
            />
            <TextField
                sx={{ marginTop: 2 }}
                id="outlined-multiline-static"
                label="Address"
                multiline
                rows={3}
                fullWidth
                 value={userData.userAddress}
                        onChange={(e) => setUserData({ ...userData, userAddress: e.target.value })}
            />
               <FormControl sx={{ marginTop: 2 }}>
                <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Admin"
                    value={userData.userRole}
                            onChange={(e) => setUserData({ ...userData, userRole: e.target.value })}
                >
                    <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="Service" control={<Radio />} label="Service" />
                    <FormControlLabel value="Inventory" control={<Radio />} label="Inventory" />
                    <FormControlLabel value="Managing Staff" control={<Radio />} label="Managing Staff" />
                    <FormControlLabel value="Technician" control={<Radio />} label="Technician" />
                </RadioGroup>
            </FormControl>
          
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} >
              Cancel
            </Button>
            <Button color="success" onClick={handleUpdateSubmit}>
                Update user
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  )
}

export default Users