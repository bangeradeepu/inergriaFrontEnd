import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import WorkList from "./workList";
import Home from "./home";
import Schedule from "./schedule";
import Inventory from "./inventoryManage";
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
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="WorkList" />
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
                  <ListItemText primary="Inventory Manage" />
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
              <Inventory serverAPI={serverAPI} workDataFetch={workDataFetch} />
            }
          ></Route>
         
        </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
