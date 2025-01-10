import React, { useState } from 'react'

function TreeNode() {
  const [measurement, setMeasurement] = useState(null)
  const [threshold, setThreshold] = useState('')

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    try {
      const droppedMeasurement = JSON.parse(e.dataTransfer.getData('measurement'))
      setMeasurement(droppedMeasurement)
    } catch (error) {
      console.error('Error dropping measurement:', error)
    }
  }

  const handleThresholdChange = (e) => {
    setThreshold(e.target.value)
  }

  return (
    <div className="node-container">
      <div 
        className={`node ${!measurement ? 'node-empty' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!measurement ? (
          <div className="node-placeholder">Drop measurement here</div>
        ) : (
          <>
            <div className="measurement-display">
              {measurement.name} ({measurement.unit})
            </div>
            <input 
              type="number"
              placeholder="Enter threshold..."
              className="threshold-input"
              value={threshold}
              onChange={handleThresholdChange}
            />
          </>
        )}
      </div>
      
      {measurement && threshold && (
        <div className="children">
          <div className="child">
            <div className="child-label">&le; {threshold}</div>
            <TreeNode />
          </div>
          <div className="child">
            <div className="child-label">&gt; {threshold}</div>
            <TreeNode />
          </div>
        </div>
      )}
    </div>
  )
}

export default TreeNode