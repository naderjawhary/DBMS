import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'

const TreeNode = forwardRef((props, ref) => {
  const [measurement, setMeasurement] = useState(null)
  const [threshold, setThreshold] = useState('')
  const leftChildRef = useRef(null)
  const rightChildRef = useRef(null)

  const getNodeData = () => {
    const nodeData = {
      measurement: measurement,
      threshold: threshold ? parseFloat(threshold) : null,
      children: {
        left: leftChildRef.current?.getNodeData() || null,
        right: rightChildRef.current?.getNodeData() || null
      }
    }
    return nodeData
  }

  useImperativeHandle(ref, () => ({
    getNodeData
  }))

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
            <TreeNode ref={leftChildRef} />
          </div>
          <div className="child">
            <div className="child-label">&gt; {threshold}</div>
            <TreeNode ref={rightChildRef} />
          </div>
        </div>
      )}
    </div>
  )
})

export default TreeNode