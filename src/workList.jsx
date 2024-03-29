import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom';

const workList = ({ serverAPI, workDataFetch,setWorkDataFetch }) => {
  // const navigate = useNavigate();

  const sortedData = workDataFetch.sort((a, b) => new Date(a.nextServiceDate) - new Date(b.nextServiceDate));

  const updateTheDate = async (id) => {
    try {
      const putData = await axios.put(`${serverAPI}/api/workApi/${id}`);
      console.log('Successfully Updated');

      const putServiceTerm = await axios.post(`${serverAPI}/api/updateServiceTerms`, {
        wId: id
      });
    } catch (error) {
      console.error(error);
    }

  }
  const sendReminder = async (id) => {
    try {
      await axios.put(`${serverAPI}/api/sendNotification/${id}`);
      alert('Reminders sent successfully.');
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  }

  const [widData, setWidData] = useState([]);
  const showAllData = async (id) => {
    try {
      const getWidData = await axios.get(`${serverAPI}/api/updateServiceTerms/${id}`);
      setWidData(getWidData.data);
    } catch (error) {
      console.error(error);
    }
  }


  const [countService, setCountService] = useState([]);
  useEffect(() => {
    const showLogs = async () => {
      try {
        const getWidData = await axios.get(`${serverAPI}/api/updateServiceTerms`);
        setCountService(getWidData.data);
      } catch (error) {
        console.error(error);
      }
    }
    showLogs();
  }, [])


  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const updateScheduleDateTime = async (id) => {
    try {
      const putSchedule = await axios.put(`${serverAPI}/api/updateUpcomingService/${id}`, {
        nextServiceDate: scheduleDateTime
      });
      
      if (putSchedule.status === 200) {
        const updatedData = await axios.get(`${serverAPI}/api/workApi`);
        setWorkDataFetch(updatedData.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  const formatDateTime = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
    return `${dayOfWeek}, ${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };


  const handleNewPageOpen = async(id) => {
    console.log(id);
    <DynamicPage />
  }
  return (
    <div>
      <h1>Upcoming Service</h1>
      {sortedData.map((workData) => (
        <div key={workData._id}>
          <p>{workData.name}</p>
          <p>Created Date: {formatDateTime(workData.createdAt)}</p>
          <p>Modified Date(Last Service On): {formatDateTime(workData.modifiedAt)}</p>
          <p>Upcoming Service Date: {formatDateTime(workData.nextServiceDate)}</p>

          <button onClick={() => updateTheDate(workData._id)}>Update Service</button>
          <button onClick={() => sendReminder(workData._id)}>Send Reminder</button>
          <input type="datetime-local" name="" value={scheduleDateTime} onChange={(e) => setScheduleDateTime(e.target.value)} id="" />
          <button onClick={() => updateScheduleDateTime(workData._id)}>Update Date Time</button>
          {countService.filter(data => data.wId === workData._id).length > 0 && (
            <p>Total Services Done: {countService.filter(data => data.wId === workData._id).length}</p>
          )}
          <button onClick={() => showAllData(workData._id)}>Show All</button>
          {/* <button onClick={() => window.open(`/dynamicPage?did=${workData._id}`, '_blank')}>Open New Page</button>
          <button onClick={() => navigate(`/dynamicPage?did=${workData._id}`)}>Open New Page</button> */}

          <br />
          <hr />
        </div>
      ))}

      {widData.length > 0 && (
        <div>
          Last updated date
          {widData.map((widD) => (
            <div key={widD._id}>
              <div>{formatDateTime(widD.createdAt)}</div>
            </div>
          ))}
          Total Services {widData.length}
          {widData.length > 4 ? (
            <p>Paid Service</p>
          ) : (
            <p>Free Service</p>
          )}
        </div>
      )}

    </div>
  )
}

export default workList