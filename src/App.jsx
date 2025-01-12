import React, { useRef } from 'react'
import TreeNode from './TreeNode'
import MeasurementsList from './MeasurementsList'
import api from './api'

function App() {
  const treeRef = useRef(null)

  const handleSaveTree = async () => {
    try {
      const treeData = treeRef.current.getNodeData()
      const response = await api.post('/trees', { rootNode: treeData })
      console.log('Tree saved successfully:', response.data)
      alert('Tree saved successfully!')
    } catch (error) {
      console.error('Error saving tree:', error)
      alert('Error saving tree')
    }
  }

  const handleLoadTrees = () => {
    console.log('Load trees clicked')
  }

  return (
    <div className="container">
      <h1>Athlete Diagnosis Tree Builder</h1>
      <div className="control-panel">
        <button onClick={handleSaveTree}>Save Tree</button>
        <button onClick={handleLoadTrees}>Load Trees</button>
      </div>
      <div className="main-content">
        <MeasurementsList />
        <div className="tree-container">
          <TreeNode ref={treeRef} />
        </div>
      </div>
    </div>
  )
}

export default App