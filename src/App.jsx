import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import WorkList from "./workList";
import Home from "./home";
import Schedule from "./schedule";
import Inventory from "./inventoryManage";
import Users from "./Users";
import Cookies from "js-cookie";

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryLogs from './inventoryLogs';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Chip from '@mui/material/Chip';


import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Logout } from "@mui/icons-material";


const App = () => {
  const CookieUserId = Cookies.get('userId');
  const CookieUserName = Cookies.get('userName');
  const CookieUserRole =Cookies.get('userRole');
  const CookieUserEmail = Cookies.get('userEmail');
  const CookieId = Cookies.get('id')
  useEffect(() => {
    if (CookieUserId) {
      console.log("User ID from cookie:", CookieUserId);
      setIsLoggedIn(true);
    }
  }, []);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const serverAPI = import.meta.env.VITE_API_LINK;
  const [workDataFetch, setWorkDataFetch] = useState([]);
  useEffect(() => {
    const fetchWorkData = async () => {
      try {
        const getWorkData = await axios.get(`${serverAPI}/api/workApi`);
        setWorkDataFetch(getWorkData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkData();
  }, []);
  const [inventories,setInventories] = useState([]);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const getInventory = await axios.get(`${serverAPI}/api/inventory`);
        console.log(getInventory.data);
        setInventories(getInventory.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInventory();
  }, []);
  const formatDateTime = (dateString) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
    return `${dayOfWeek}, ${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };
  const [inventoryLogs, setInventoryLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${serverAPI}/api/inventoryLogs`);
            // Sort the data in descending order based on createdAt
            const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setInventoryLogs(sortedData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);
      const [isLoggedIn,setIsLoggedIn] = useState(false);
      const [userName, setUserName] = useState('');
      const [password, setPassword] = useState('');
      const [loading,setLoading] = useState(false);
      const [loginErrorMsgEmail,setLoginErrorMsgEmail] = useState('')
      const [loginErrorMsgPass,setLoginErrorMsgPass] = useState('')


     

      const handleLogin = async () => {
        setLoading(true);
        setLoginErrorMsgEmail('');
        setLoginErrorMsgPass('');
        try {
          const response = await axios.get(`${serverAPI}/api/userLogin/${userName}/${password}`);
          if (response.data.length > 0) {
            console.log("Login successful");
            Cookies.set('id', response.data[0]._id, { expires: 7 });
            Cookies.set('userEmail', response.data[0].userEmail, { expires: 7 });
            Cookies.set('userId', response.data[0].userId, { expires: 7 });
            Cookies.set('userRole', response.data[0].userRole, { expires: 7 });
            Cookies.set('userName', response.data[0].userName, { expires: 7 });
            setLoading(false);
            setIsLoggedIn(true);
            setUserName('');
            setPassword('');
          } else {
            console.log("Invalid username or password");
            setLoginErrorMsgEmail('Please enter a valid email address');
            setLoginErrorMsgPass('Please enter a correct password');
            setLoading(false);
           

          }
        } catch (error) {
          console.error("Error during login:", error);
          setLoginErrorMsgEmail('Please enter a valid email address');
          setLoginErrorMsgPass('Please enter a correct password');
          setLoading(false);
        }
      };
      const handleLogout = () => {
        Cookies.remove('id');
        Cookies.remove('userEmail');
        Cookies.remove('userId');
        Cookies.remove('userRole');
        Cookies.remove('userName');
        setIsLoggedIn(false);
      };

      const chipColor =
    CookieUserRole === 'Admin' ? 'success' :
    CookieUserRole === 'Service' ? 'primary' :
    CookieUserRole === 'Inventory' ? 'info' :
    CookieUserRole === 'Managing Staff' ? 'warning' :
    CookieUserRole === 'Technician' ? 'secondary' :
    'info';
  return (
    <div>
     

      <Router>
        
      {CookieUserId ? (
        <div>
          <div className="topNav pd-1 bg-white">
            <div className="flex space-between align-item-center">
            <Typography sx={{ fontSize: 24 }}><span className="primary">Inergeia</span>&nbsp;<span>Panel Care</span></Typography>
              <div className="flex g2 align-item-center">
              <Typography sx={{ fontSize: 16 }}>Hi,{CookieUserName}</Typography>
              <Chip label={CookieUserRole} color={chipColor} sx={{ minWidth: 120 }} />
              
                
                <MenuIcon className="c-pointer" onClick={toggleDrawer(true)} />
              </div>
              
            </div>
          </div>
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItem button>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
                <Link
                  to="/upcomingList"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary="Services" />
                  </ListItem>
                </Link>
                <Link
                  to="/inventory"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <InventoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inventory" />
                  </ListItem>
                </Link>
                <Link
                  to="/inventory"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <GroupsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Clients" />
                  </ListItem>
                </Link>
                {CookieUserRole === 'Admin' &&(
                <Link
                  to="/users"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                  </ListItem>
                  
                </Link>
                )}
              </List>
              <Divider />
              <button onClick={handleLogout}>Logout</button>
            </Box>
          </Drawer>

          <div className="pd-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  serverAPI={serverAPI}
                  workDataFetch={workDataFetch}
                  setWorkDataFetch={setWorkDataFetch}
                  invertories={inventories}
                  inventoryLogs={inventoryLogs}
                  CookieUserId={CookieUserId}
                  CookieUserName={CookieUserName}
                  CookieUserRole={CookieUserRole}
                  CookieUserEmail={CookieUserEmail}
                  CookieId={CookieId}
                />
              }
            ></Route>
            <Route
              path="/upcomingList"
              element={
                <WorkList
                  serverAPI={serverAPI}
                  workDataFetch={workDataFetch}
                  setWorkDataFetch={setWorkDataFetch}
                  CookieUserId={CookieUserId}
                  CookieUserName={CookieUserName}
                  CookieUserRole={CookieUserRole}
                  CookieUserEmail={CookieUserEmail}
                  CookieId={CookieId}
                />
              }
            ></Route>

            <Route
              path="/schedule"
              element={
                <Schedule serverAPI={serverAPI} workDataFetch={workDataFetch}
                CookieUserId={CookieUserId}
                CookieUserName={CookieUserName}
                CookieUserRole={CookieUserRole}
                CookieUserEmail={CookieUserEmail}
                CookieId={CookieId}
                 />
              }
            ></Route>
            <Route
              path="/inventory"
              element={
                <Inventory serverAPI={serverAPI} workDataFetch={workDataFetch}
                CookieUserId={CookieUserId}
                CookieUserName={CookieUserName}
                CookieUserRole={CookieUserRole}
                CookieUserEmail={CookieUserEmail}
                CookieId={CookieId}
                  />
              }
            ></Route>
            <Route path="/inventoryLogs" element={<InventoryLogs serverAPI={serverAPI}
             CookieUserId={CookieUserId}
             CookieUserName={CookieUserName}
             CookieUserRole={CookieUserRole}
             CookieUserEmail={CookieUserEmail}
             CookieId={CookieId}
             formatDateTime={formatDateTime} inventoryLogs={inventoryLogs} />}></Route>
             {CookieUserRole === 'Admin' &&(
 <Route
 path="/users"
 element={
   <Users serverAPI={serverAPI} workDataFetch={workDataFetch} 
   CookieUserId={CookieUserId}
   CookieUserName={CookieUserName}
   CookieUserRole={CookieUserRole}
   CookieUserEmail={CookieUserEmail}
   CookieId={CookieId}
   formatDateTime={formatDateTime} />
 }
></Route>
             )}
           
          </Routes>
          </div>
        </div>
        ):(
          <div>
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 5, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box noValidate sx={{ mt: 1 }}>
              <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name=""
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        autoComplete="email"
        autoFocus
        error={!!loginErrorMsgEmail}
        helperText={loginErrorMsgEmail}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        error={!!loginErrorMsgPass}
        helperText={loginErrorMsgPass}
      />
               
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleLogin}
                  sx={{ mt: 3, mb: 2 }}
                  disabled ={loading}
                >
                  {loading ? (
                    <CircularProgress size={25} color="success" />
                  ):(
                    <>Sign in</>
                  )}
                    
                </Button>
              </Box>
            </Box>
          </Container>
          </div>
        )}
      </Router>
    </div>
  );
};

export default App;
