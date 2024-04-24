// InventoryManage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField, // Import TextField from Material-UI
} from "@mui/material";

const InventoryManage = ({ serverAPI, workDataFetch }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [updateQty, setUpdateQty] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openLessModal, setOpenLessModal] = useState(false);
  const [openCreateModal,setOpenCreateModal] = useState(false);
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
      setQuantity('');
      setOpenCreateModal(false);
      setErrorMessage('');
      setInventoryData([...inventoryData, response.data]);
      setFilteredInventoryData([...filteredInventoryData, response.data]);
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const getInventory = await axios.get(`${serverAPI}/api/inventory`);
        console.log(getInventory.data);
        setInventoryData(getInventory.data);
        setFilteredInventoryData(getInventory.data); // Initialize filtered data with all data
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
  }

  const handleCloseCreateModal =() => {
    setOpenCreateModal(false);
    setErrorMessage('');
  }
  const handleSearch = (searchTerm) => {
    const filteredItems = inventoryData.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventoryData(filteredItems);
  };
  return (
    <div>
      <br />
      <br />
     <div className="d-flex space-between">
     <TextField
        type="text"
        value={searchBox}
        onChange={(e) => {
          setSeachBox(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search Inventory"
        size="small"
      />
     <Button onClick={handleOpenCreateModal}  style={{ color: "white", backgroundColor: "black" }}>Create Inventory</Button>
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
            <Button onClick={handleCloseCreateModal}>Cancel</Button>
            <Button
        onClick={handleSubmit}
        style={{ color: "white", backgroundColor: "green" }}
      >
        Create
      </Button>
          </DialogActions>
          
        </Dialog>
     
     
     
      {filteredInventoryData.map((inventory) => (
        <div key={inventory._id}>
          <hr />
          <div className="d-flex space-between">
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
                style={{ color: "white", backgroundColor: "green" }}
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
                style={{ color: "white", backgroundColor: "red" }}
              >
                Less
              </Button>
              <Button onClick={() => handleDelete(inventory._id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div>
        <Dialog open={openAddModal} onClose={handleCloseAddModal} fullWidth>
          <DialogTitle>Add Inventory</DialogTitle>
          <DialogContent>
            <p>Inventory ID: {selectedAddInventoryId}</p>
            <p>Inventory Name: {selectedAddInventoryName}</p>
            <p>In Stock: {selectedAddInventoryQty}</p>
            <TextField
              label="Quantity"
              type="number"
              value={updateQty}
              onChange={(e) => setUpdateQty(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddModal}>Cancel</Button>
            <Button
              style={{ color: "white", backgroundColor: "green" }}
              onClick={() => handleAdd(selectedAddInventoryId)}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openLessModal} onClose={handleCloseLessModal} fullWidth>
          <DialogTitle>Less Inventory</DialogTitle>
          <DialogContent>
            <p>Inventory ID: {selectedLessInventoryId}</p>
            <p>Inventory Name: {selectedLessInventoryName}</p>
            <p>In stock: {selectedLessInventoryQty}</p>
            <TextField
              label="Quantity"
              type="number"
              value={updateQty}
              onChange={(e) => setUpdateQty(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLessModal}>Cancel</Button>
            <Button
              style={{ color: "white", backgroundColor: "red" }}
              onClick={() => handleLess(selectedLessInventoryId)}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default InventoryManage;
