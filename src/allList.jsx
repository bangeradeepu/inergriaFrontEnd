import React from 'react'

const allList = ({serverAPI,workDataFetch}) => {
  return (
    <div>
       {workDataFetch.map((workData) => (
  <div key={workData._id}>
  <p>{workData.name}</p>
  <p>Created Date: {new Date(workData.createdAt).toLocaleString()}</p>
  <p>Modified Date: {new Date(workData.modifiedAt).toLocaleString()}</p>
  <hr />
  </div>
))}
    </div>
  )
}

export default allList