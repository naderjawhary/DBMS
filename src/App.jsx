import React from 'react'
import TreeNode from './TreeNode'
import MeasurementsList from './MeasurementsList'

function App() {
  return (
    <div className="container">
      <h1>Athlete Diagnosis Tree Builder</h1>
      <div className="main-content">
        <MeasurementsList />
        <div className="tree-container">
          <TreeNode />
        </div>
      </div>
    </div>
  )
}

export default App