import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import WorkList from "./workList";
import Home from "./home";
import Schedule from "./schedule";
import Inventory from "./inventoryManage";
import Users from "./Users";
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
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryLogs from './inventoryLogs';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const App = () => {
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
  return (
    <div>
      <Router>
        <div className="topNav pd-1 bg-white">
          <div className="flex space-between align-item-center">
            <div className="f14"><span className="primary">Inergeia</span>&nbsp;<span>Panel Care</span></div>
            <div>
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
              
            </List>
            <Divider />
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
              />
            }
          ></Route>

          <Route
            path="/schedule"
            element={
              <Schedule serverAPI={serverAPI} workDataFetch={workDataFetch} />
            }
          ></Route>
          <Route
            path="/inventory"
            element={
              <Inventory serverAPI={serverAPI} workDataFetch={workDataFetch}  />
            }
          ></Route>
          <Route path="/inventoryLogs" element={<InventoryLogs serverAPI={serverAPI} formatDateTime={formatDateTime} inventoryLogs={inventoryLogs} />}></Route>
          <Route
            path="/users"
            element={
              <Users serverAPI={serverAPI} workDataFetch={workDataFetch} formatDateTime={formatDateTime} />
            }
          ></Route>
        </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
