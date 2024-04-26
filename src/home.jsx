import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from 'react-router-dom';

const home = ({ serverAPI, workDataFetch, setWorkDataFetch, invertories,inventoryLogs }) => {
  const navigate = useNavigate();
  const [textFeild, setTextFeild] = useState("");
  const handleSubmit = async () => {
    try {
      const postWorkData = await axios.post(`${serverAPI}/api/workApi`, {
        name: textFeild,
      });
      setWorkDataFetch([...workDataFetch, postWorkData.data]);
    } catch (error) {
      console.error(error);
    }
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
      <div className="flex space-between flex-cols">
        <div className="box-1 align-item-center  pd-1">
          <div className="bannerMain">
            <div className="flex hsjj">
              <img
                src="https://i.pinimg.com/originals/86/0d/43/860d43ca683490df0a1461d792fb1bca.gif"
                alt=""
                className="ihyq"
              />
              <div className="f36">
              <Typography
                  sx={{ fontSize: 44 }}
                  className="primary"
                >
                  Inergeia
                </Typography>
                <Typography
                  sx={{ fontSize: 42 }}
                  
                >
                  Panel Care
                </Typography>
              </div>
            </div>
          </div>
          <div>
            <Card className="mt-1" sx={{ height: 465 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  User Status
                </Typography>
                <Box sx={{ maxHeight: "350px", overflow: "auto" }}>
                  <Table aria-label="simple table">
                    <TableBody>
                      {invertories.map((row) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.itemName}
                          </TableCell>
                          <TableCell align="right">{row.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small">Go to Stock Management</Button>
              </CardActions>
            </Card>
          </div>
        </div>
        <div className="box-1 pd-1">
          <Card sx={{ height: 608 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                User Logs
              </Typography>
              <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
                <Table aria-label="simple table">
                  <TableBody>
                    {inventoryLogs.slice(0, 20).map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.itemName}
                        </TableCell>
                        <TableCell align="right">
                        {row.stocksStatus === 'INC' ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} className="primary">+ {row.stocks}</Typography>
              ) : row.stocksStatus === 'DEC' ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }} className="red">- {row.stocks}</Typography>
              ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/inventoryLogs')}>View More</Button>
            </CardActions>
          </Card>
        </div>
        <div className="box-1 pd-1">
          <div className="">
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Total Clients
                </Typography>
                <Typography variant="h5" component="div">
                  500
                </Typography>
                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                  Upcoming Maintanance
                </Typography>
              </CardContent>
              <Table aria-label="simple table">
                <TableBody>
                  {workDataFetch.slice(0, 3).map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>

                      <TableCell align="right">
                        {formatDateTime(row.nextServiceDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <CardActions>
                <Button size="small">View More</Button>
              </CardActions>
            </Card>
          </div>
          <Card className="mt-1">
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Inventories
              </Typography>
              <Table aria-label="simple table">
                <TableBody>
                  {invertories.slice(0, 3).map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.itemName}
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardActions>
              <Button size="small"  onClick={() => navigate('/upcomingList')}>Go to Stock Management</Button>
            </CardActions>
          </Card>
        </div>
      </div>
      {/* <input type="text" name="" value={textFeild} onChange={(e) => setTextFeild(e.target.value)} id="" />
        <button onClick={handleSubmit}>Submit</button> */}
    </div>
  );
};

export default home;
