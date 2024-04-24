import React, {useEffect,useState} from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from 'axios'
import WorkList from './workList'
import Home from './home';
import AllList from './allList';
import Schedule from './schedule';
import Inventory from './inventoryManage'
// import DynamicPage from './dynamicPage';
const App = () => {
  const serverAPI = import.meta.env.VITE_API_LINK;
  const [workDataFetch,setWorkDataFetch] = useState([]);
  useEffect(() => {
    const fetchWorkData = async() => {
        try {
            const getWorkData = await axios.get(`${serverAPI}/api/workApi`)
            setWorkDataFetch(getWorkData.data);
        } catch (error) {
            console.error(error);
        }
    }
    fetchWorkData();
},[])
  return (
    <div>
      <Router>
        <div>
          <Link to='/'>Home</Link>
          <Link to='/upcomingList'>WorkList</Link>
          <Link to='/AllList'>All List</Link>
          <Link to='/schedule'>Schedule Service</Link>
          <Link to='/inventory'>Inventory Manage</Link>
        </div>
        <Routes>
          <Route path='/' element={<Home serverAPI={serverAPI} workDataFetch={workDataFetch} setWorkDataFetch={setWorkDataFetch} />} ></Route>
          <Route path='/upcomingList' element={<WorkList serverAPI={serverAPI} workDataFetch={workDataFetch} setWorkDataFetch={setWorkDataFetch}   />}></Route>
          <Route path='/AllList' element={<AllList serverAPI={serverAPI} workDataFetch={workDataFetch}  />}></Route>
          <Route path='/schedule' element={<Schedule serverAPI={serverAPI} workDataFetch={workDataFetch}  />}></Route>
          <Route path='/inventory' element={<Inventory serverAPI={serverAPI} workDataFetch={workDataFetch} />}></Route>
          {/* <Route path='/dynamicPage' element={<DynamicPage />}></Route> */}
        </Routes>
   
      </Router>
      
    </div>
  )
}

export default App