import React, {useEffect,useState} from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const home = ({serverAPI,workDataFetch,setWorkDataFetch}) => {

const [textFeild,setTextFeild] = useState('');
const handleSubmit = async() => {
  try {
    const postWorkData = await axios.post(`${serverAPI}/api/workApi`,{
      name:textFeild
    });
    setWorkDataFetch([...workDataFetch,postWorkData.data]);
  } catch (error) {
    console.error(error);
  }
}
  return (
    <div>
        <h1>Home</h1>
        <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '50ch' },
      }}
      noValidate
      autoComplete="off"
      size="small"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" size="small" color='success' margin='normal' />
      <TextField id="filled-basic" label="Filled" variant="filled"size="small" />
      <TextField id="standard-basic" label="Standard" variant="standard" size="small" color='success'/>
      
    </Box>
    <Button variant="contained" color="success">
        Success
      </Button>
        <input type="text" name="" value={textFeild} onChange={(e) => setTextFeild(e.target.value)} id="" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default home