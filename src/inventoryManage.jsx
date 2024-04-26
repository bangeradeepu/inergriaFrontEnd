// InventoryManage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Typography from "@mui/material/Typography";
import { TableVirtuoso } from "react-virtuoso";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField, // Import TextField from Material-UI
} from "@mui/material";

const InventoryManage = ({ serverAPI, workDataFetch }) => {
  const navigate = useNavigate();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [updateQty, setUpdateQty] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openLessModal, setOpenLessModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);
  const [searchBox, setSeachBox] = useState("");
  const [selectedAddInventoryId, setSelectedAddInventoryId] = useState(null);
  const [selectedAddInventoryName, setSelectedAddInventoryName] =
    useState(null);
  const [selectedAddInventoryQty, setSelectedAddInventoryQty] = useState(null);

  const [selectedLessInventoryId, setSelectedLessInventoryId] = useState(null);
  const [selectedLessInventoryName, setSelectedLessInventoryName] =
    useState(null);
  const [selectedLessInventoryQty, setSelectedLessInventoryQty] =
    useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${serverAPI}/api/inventory`, {
        itemName,
        quantity,
      });
      console.log(response.data);
      setItemName("");
      setQuantity("");
      setOpenCreateModal(false);
      setErrorMessage("");
      setInventoryData([...inventoryData, response.data]);
      setFilteredInventoryData([...filteredInventoryData, response.data]);
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  const handleInventoryLogs = async (
    stocks,
    stocksStatus,
    itemId,
    stockName
   
  ) => {
    console.log(stockName);
    if(stocksStatus === 'INC'){
      handleAdd(itemId);
    }else if(stocksStatus === 'DEC'){
      handleLess(itemId)
    }
   
    try {
      const response = await axios.post(`${serverAPI}/api/inventoryLogs`, {
        userId: 613688,
        userName: 'Deepesh',
        stocks,
        stocksStatus, 
        itemId,
        itemName:stockName,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
useEffect(() => {
  const fetchInventory = async () => {
    try {
      const getInventory = await axios.get(`${serverAPI}/api/inventory`);
      console.log(getInventory.data);
      // Sort the data in descending order based on quantity
      const sortedInventory = getInventory.data.sort((a, b) => b.quantity - a.quantity);
      setInventoryData(sortedInventory);
      setFilteredInventoryData(sortedInventory); // Initialize filtered data with sorted data
    } catch (error) {
      console.error(error);
    }
  };
  fetchInventory();
}, []);


  const handleAdd = async (inventoryId) => {
    try {
      const response = await axios.put(
        `${serverAPI}/api/inventory/${inventoryId}/${updateQty}/INC`
      );
      console.log(response.data);
      const updatedInventory = await axios.get(`${serverAPI}/api/inventory`);
      setInventoryData(updatedInventory.data);
      setFilteredInventoryData(updatedInventory.data);
      handleCloseAddModal();
      handleClearData();
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  const handleLess = async (inventoryId) => {
    try {
      const response = await axios.put(
        `${serverAPI}/api/inventory/${inventoryId}/${updateQty}/DEC`
      );
      console.log(response.data);
      const updatedInventory = await axios.get(`${serverAPI}/api/inventory`);
      setInventoryData(updatedInventory.data);
      setFilteredInventoryData(updatedInventory.data);
      handleCloseLessModal();
      handleClearData();
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  const handleDelete = async (inventoryId) => {
    try {
      await axios.delete(`${serverAPI}/api/inventory/${inventoryId}`);
      const updatedInventory = await axios.get(`${serverAPI}/api/inventory`);
      setInventoryData(updatedInventory.data);
      setFilteredInventoryData(updatedInventory.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClearData = () => {
    setSelectedAddInventoryId(null);
    setSelectedAddInventoryName(null);
    setSelectedAddInventoryQty(null);
    setSelectedAddInventoryId(null);
    setSelectedAddInventoryName(null);
    setSelectedAddInventoryQty(null);
    setUpdateQty("");
  };
  const handleAddInventory = (inventoryId, itemName, qty) => {
    setOpenAddModal(true);
    setSelectedAddInventoryId(inventoryId);
    setSelectedAddInventoryName(itemName);
    setSelectedAddInventoryQty(qty);
  };

  const handleLessInventory = (inventoryId, itemName, qty) => {
    setOpenLessModal(true);
    setSelectedLessInventoryId(inventoryId);
    setSelectedLessInventoryName(itemName);
    setSelectedLessInventoryQty(qty);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    handleClearData();
  };
  const handleCloseLessModal = () => {
    setOpenLessModal(false);
    handleClearData();
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setErrorMessage("");
    setItemName("");
  };
  const handleSearch = (searchTerm) => {
    const filteredItems = inventoryData.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventoryData(filteredItems);
  };

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
  return (
    <div>
      <Typography sx={{ fontSize: 28 }}>Inventory Management</Typography>
      <div className="flex space-between mt-1">
        <TextField
          sx={{ minWidth: 400 }}
          type="text"
          value={searchBox}
          onChange={(e) => {
            setSeachBox(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search Inventory"
          size="small"
        />
        <div className="flex g2">
          <Button variant="outlined" color="success" onClick={() => navigate('/inventoryLogs')}>Inventory Logs</Button>

          <Button onClick={handleOpenCreateModal} color="success" variant="contained">
            Create Inventory
          </Button>
        </div>
      </div>
      <Dialog open={openCreateModal} onClose={handleCloseCreateModal} fullWidth>
        <DialogTitle>Create Inventory</DialogTitle>
        <DialogContent>
          <br />
          <div>
            <TextField
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
              fullWidth
            />
          </div>
          <br />
          <div>
            <TextField
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              label="Quantity"
              fullWidth
            />
          </div>
          <br />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCreateModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} className="mt-2">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="">Stocks</TableCell>
              <TableCell align="">Last Modified</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventoryData.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.itemName}
                </TableCell>
                <TableCell align="">{row.quantity}</TableCell>
                <TableCell align="">{formatDateTime(row.modifiedAt)}</TableCell>

                <TableCell align="right" className="flex g2">
                  <Button
                    size="small"
                    onClick={() =>
                      handleAddInventory(row._id, row.itemName, row.quantity)
                    }
                    color="success"
                    variant="outlined"
                  >
                    Add
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    size="small"
                    onClick={() =>
                      handleLessInventory(row._id, row.itemName, row.quantity)
                    }
                    variant="outlined"
                    color="warning"
                  >
                    Less
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    onClick={() => handleDelete(row._id)}
                    variant="outlined"
                    color="error"
                  >
                    <DeleteIcon></DeleteIcon>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* {filteredInventoryData.map((inventory) => (
        <div key={inventory._id}>
          <hr />
          <div className="flex space-between">
            <div>
              <div>Item Name: {inventory.itemName}</div>
              <div>In Stock: {inventory.quantity}</div>
            </div>
            <div>
              <Button
                size="small"
                onClick={() =>
                  handleAddInventory(
                    inventory._id,
                    inventory.itemName,
                    inventory.quantity
                  )
                }
                color="success"
                variant="contained"
              >
                Add
              </Button>
              &nbsp;&nbsp;
              <Button
                size="small"
                onClick={() =>
                  handleLessInventory(
                    inventory._id,
                    inventory.itemName,
                    inventory.quantity
                  )
                }
                color="error"
                variant="contained"
              >
                Less
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => handleDelete(inventory._id)} variant="outlined">
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))} */}
      <div>
        <Dialog open={openAddModal} onClose={handleCloseAddModal} fullWidth>
          <DialogTitle>Add Inventory</DialogTitle>
          <DialogContent>
            <div>
              <div className="flex">
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Inventory ID:
                </Typography>
                &nbsp;
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                  {selectedAddInventoryId}
                </Typography>
              </div>
              <div className="flex">
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Inventory Name:
                </Typography>
                &nbsp;
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                  {selectedAddInventoryName}
                </Typography>
              </div>
              <div className="flex">
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  In Stock:
                </Typography>
                &nbsp;
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                  {selectedAddInventoryQty}
                </Typography>
              </div>
            </div>
            <div className="mt-2"></div>
            <TextField
              label="Quantity"
              type="number"
              value={updateQty}
              onChange={(e) => setUpdateQty(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button
              color="success"
              onClick={() => handleInventoryLogs(updateQty, 'INC', selectedAddInventoryId, selectedAddInventoryName)}

              variant="contained"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openLessModal} onClose={handleCloseLessModal} fullWidth>
          <DialogTitle>Less Inventory</DialogTitle>
          <DialogContent>
            <div className="flex">
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Inventory ID:
              </Typography>
              &nbsp;
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                {selectedLessInventoryId}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Inventory Name:
              </Typography>
              &nbsp;
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                {selectedLessInventoryName}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                In stock:
              </Typography>
              &nbsp;
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                {selectedLessInventoryQty}
              </Typography>
            </div>
            <div className="mt-2"></div>
            <TextField
              label="Quantity"
              type="number"
              value={updateQty}
              onChange={(e) => setUpdateQty(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseLessModal}>
              Cancel
            </Button>
            <Button
              color="error"
              onClick={() => handleInventoryLogs(updateQty, 'DEC', selectedLessInventoryId, selectedLessInventoryName)}
              variant="contained"
            >
              Less
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default InventoryManage;
