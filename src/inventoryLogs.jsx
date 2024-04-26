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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField, // Import TextField from Material-UI
} from "@mui/material";

const inventoryLogs = ({serverAPI,formatDateTime,inventoryLogs,CookieUserId,CookieUserName,CookieUserRole,CookieUserEmail,CookieId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
      
  return (
    <div>
        <div className="flex space-between align-item-center">
            <div>
            <Typography sx={{ fontSize: 28 }}>Inventory Logs</Typography>
        <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          href="/inventory"
        >
          Inventory
        </Link>
        <Typography color="text.primary">Inventory Logs</Typography>
      </Breadcrumbs>
            </div>
            <TextField
        type="text"
        sx={{ minWidth: 400 }}
        placeholder="Search by User name, UserID, Item Name"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
        </div>
       
        <div className="mt-1"></div>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell align="">User Name</TableCell>
            <TableCell align="center">Stocks</TableCell>
            <TableCell align="right">Modified On</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
        {inventoryLogs
        .filter((row) =>
          (row.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (row.userId || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          (row.itemName || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((filteredRow) => (
          <TableRow key={filteredRow._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">{filteredRow.itemName}</TableCell>
            <TableCell align="">{filteredRow.userId}</TableCell>
            <TableCell align="">{filteredRow.userName}</TableCell>
            <TableCell align="center">
              {filteredRow.stocksStatus === 'INC' ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} className="primary">+ {filteredRow.stocks}</Typography>
              ) : filteredRow.stocksStatus === 'DEC' ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} className="red">- {filteredRow.stocks}</Typography>
              ) : null}
            </TableCell>
            <TableCell align="right">{formatDateTime(filteredRow.createdAt)}</TableCell>
           
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default inventoryLogs