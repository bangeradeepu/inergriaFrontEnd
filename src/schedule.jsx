import React,{useState,useEffect} from 'react'
import axios from 'axios';

const schedule = ({serverAPI,workDataFetch}) => {
  const [broadCastMessage,setBroadCastMessage] = useState('');
  const handleBroadCastSend = async() => {
    try {
      const postBroadCast = await axios.post(`${serverAPI}/api/sendBroadCastMessage`,{
        broadCastMessage:broadCastMessage
      })
      // alert("Boradcast Message sent successfully")
    } catch (error) {
      console.error(error);
    }
  }


  const [customMessage,setCustomMessage] = useState('');
  const [customTime,setCustomTime] = useState('');

  useEffect(() => {
    const getCustomMessage = async () => {
      try {
        const getMessage = await axios.get(`${serverAPI}/api/customMessage`);
        if (getMessage.data.length > 0) {
          setCustomMessage(getMessage.data[0].message); // Set data from the 0th index message property
        } else {
          console.error('No data found.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getCustomMessage(); // Call the function
  }, [serverAPI]);
  

  const handleMessageSubmit = async () => {
    try {
      if (!customMessage) {
        console.error('Message cannot be empty');
        return;
      }
      const getMessage = await axios.get(`${serverAPI}/api/customMessage`);
      if (getMessage.data.length > 0) {
        const putMessage = await axios.put(`${serverAPI}/api/customMessage/${getMessage.data[0]._id}`, { message: customMessage });
        console.log('Message Set');
      } else {
        const postMessage = await axios.post(`${serverAPI}/api/customMessage`, { message: customMessage });
        console.log('Message Set');
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  useEffect(() => {
    const getCustomTime = async () => {
      try {
        const getTime = await axios.get(`${serverAPI}/api/customTime`);
        if (getTime.data.length > 0) {
          const { hour, minute } = getTime.data[0];
          const formattedTime = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
          setCustomTime(formattedTime); // Update state with formatted time
        } else {
          console.error('No data found.');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    getCustomTime(); // Call the function
  }, [serverAPI]);
  

  const handleTimeSubmit = async() => {
    try {
      if (!customTime) {
        console.error('Message cannot be empty');
        return;
      }
      const getTime = await axios.get(`${serverAPI}/api/customTime`);
      if (getTime.data.length > 0) {
        const putTime = await axios.put(`${serverAPI}/api/customTime/${getTime.data[0]._id}`, { time: customTime });
        console.log('Message Set');
      } else {
        const postTime = await axios.post(`${serverAPI}/api/customTime`, { time: customTime });
        console.log('Message Set');
      }
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <div>
      <p>Boradcast message</p>
        <input type="text" name="" id="" value={broadCastMessage} onChange={(e) => setBroadCastMessage(e.target.value)} />
        <button onClick={handleBroadCastSend}>Send</button>
        <hr />
        <p>Notification Settings</p>
        <br />
        <p>Set Message for automated message</p>
        <input type="text" name="" placeholder='' value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} id="" />
        <button onClick={handleMessageSubmit}>Set</button>
        <br />
        <p>Set Time for automated message to send</p>
        <input type="time" name="" id="" value={customTime} onChange={(e) => setCustomTime(e.target.value)} />
        <button onClick={handleTimeSubmit}>Set</button>
    </div>
  )
}

export default schedule