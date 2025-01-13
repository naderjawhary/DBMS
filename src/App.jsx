import React, { useRef, useState } from 'react'
import TreeNode from './TreeNode'
import MeasurementsList from './MeasurementsList'
import api from './api'

function App() {
  const treeRef = useRef(null)
  const [savedTrees, setSavedTrees] = useState([])
  const [currentTreeData, setCurrentTreeData] = useState(null)

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

  const handleLoadTrees = async () => {
    try {
      const response = await api.get('/trees')
      setSavedTrees(response.data)
      console.log('Trees loaded:', response.data)
    } catch (error) {
      console.error('Error loading trees:', error)
      alert('Error loading trees')
    }
  }

  const handleTreeSelect = async (treeId) => {
    try {
      if (!treeId) {
        setCurrentTreeData(null)
        return
      }
      const response = await api.get(`/trees/${treeId}`)
      setCurrentTreeData(response.data.rootNode)
    } catch (error) {
      console.error('Error loading tree:', error)
      alert('Error loading selected tree')
    }
  }

  return (
    <div className="container">
      <h1>Athlete Diagnosis Tree Builder</h1>
      <div className="control-panel">
        <button onClick={handleSaveTree}>Save Tree</button>
        <button onClick={handleLoadTrees}>Load Trees</button>
        
        {savedTrees.length > 0 && (
          <select 
            onChange={(e) => handleTreeSelect(e.target.value)}
          >
            <option value="">Select a tree to load...</option>
            {savedTrees.map(tree => (
              <option key={tree._id} value={tree._id}>
                Tree {tree._id} - Created: {new Date(tree.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="main-content">
        <MeasurementsList />
        <div className="tree-container">
          <TreeNode ref={treeRef} nodeData={currentTreeData} />
        </div>
      </div>
    </div>
  )
}

export default App