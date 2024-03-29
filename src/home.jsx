import React, {useEffect,useState} from 'react'
import axios from 'axios'

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
        <input type="text" name="" value={textFeild} onChange={(e) => setTextFeild(e.target.value)} id="" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default home