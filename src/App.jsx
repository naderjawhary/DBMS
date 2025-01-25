import React, { useRef, useState, useCallback } from 'react';
import TreeNode from './TreeNode';
import MeasurementsList from './MeasurementsList';
import api from './api';

function App() {
 const treeRef = useRef(null);
 const [savedTrees, setSavedTrees] = useState([]);
 const [currentTreeData, setCurrentTreeData] = useState(null);
 const [sidebarOpen, setSidebarOpen] = useState(true);
 const [history, setHistory] = useState([]);
 const [currentIndex, setCurrentIndex] = useState(-1);
 const [showTreeSelect, setShowTreeSelect] = useState(false);

 const addToHistory = useCallback((treeData) => {
   const newHistory = history.slice(0, currentIndex + 1);
   newHistory.push(treeData);
   setHistory(newHistory);
   setCurrentIndex(newHistory.length - 1);
 }, [history, currentIndex]);

 const undo = useCallback(() => {
   if (currentIndex > 0) {
     setCurrentIndex(currentIndex - 1);
     setCurrentTreeData(history[currentIndex - 1]);
   }
 }, [currentIndex, history]);

 const redo = useCallback(() => {
   if (currentIndex < history.length - 1) {
     setCurrentIndex(currentIndex + 1);
     setCurrentTreeData(history[currentIndex + 1]);
   }
 }, [currentIndex, history]);

 const handleDeleteTree = async (treeId) => {
   try {
     console.log('Deleting tree:', treeId);
     await api.delete(`/trees/${treeId}`);
     console.log('Tree deleted from database');
     await handleLoadTrees();
     if (currentTreeData) {
       setCurrentTreeData(null);
       setHistory([]);
       setCurrentIndex(-1);
     }
   } catch (error) {
     console.error('Error deleting tree:', error);
     alert('Error deleting tree');
   }
 };

 const handleSaveTree = async () => {
   try {
     const treeData = treeRef.current.getNodeData();
     addToHistory(treeData);
     const response = await api.post('/trees', { rootNode: treeData });
     console.log('Tree saved successfully:', response.data);
     alert('Tree saved successfully!');
   } catch (error) {
     console.error('Error saving tree:', error);
     alert('Error saving tree');
   }
 };

 const handleLoadTrees = async () => {
   try {
     const response = await api.get('/trees');
     setSavedTrees(response.data);
     setShowTreeSelect(true);
     console.log('Trees loaded:', response.data);
   } catch (error) {
     console.error('Error loading trees:', error);
     alert('Error loading trees');
   }
 };

 const handleTreeSelect = async (treeId) => {
   try {
     if (!treeId) {
       setCurrentTreeData(null);
       return;
     }
     const response = await api.get(`/trees/${treeId}`);
     const treeData = response.data.rootNode;
     setCurrentTreeData(treeData);
     addToHistory(treeData);
   } catch (error) {
     console.error('Error loading tree:', error);
     alert('Error loading selected tree');
   }
 };

 return (
   <div className="container-fluid py-4">
     <h1 className="text-center mb-4">Athlete Diagnosis Tree Builder</h1>

     <div className="row mb-4">
       <div className="col-md-6">
         <button className="btn btn-primary me-2" onClick={handleSaveTree}>
           Save Tree
         </button>
         <button className="btn btn-secondary me-2" onClick={handleLoadTrees}>
           Load Trees
         </button>
         <button 
           className="btn btn-info me-2" 
           onClick={undo}
           disabled={currentIndex <= 0}
         >
           Undo
         </button>
         <button 
           className="btn btn-info" 
           onClick={redo}
           disabled={currentIndex >= history.length - 1}
         >
           Redo
         </button>
       </div>
       <div className="col-md-6 d-flex">
         {showTreeSelect && savedTrees.length > 0 && (
           <>
             <select
               className="form-select me-2"
               onChange={(e) => handleTreeSelect(e.target.value)}
             >
               <option value="">Select a tree to load...</option>
               {savedTrees.map((tree) => (
                 <option key={tree._id} value={tree._id}>
                   Tree {tree._id} - Created: {new Date(tree.createdAt).toLocaleDateString()}
                 </option>
               ))}
             </select>
             <button 
               className="btn btn-danger"
               onClick={() => {
                 const selectedTree = document.querySelector('select').value;
                 if (selectedTree) handleDeleteTree(selectedTree);
               }}
             >
               Delete
             </button>
           </>
         )}
       </div>
     </div>

     <div className="row">
       {sidebarOpen && (
         <div className="col-lg-3">
           <MeasurementsList />
         </div>
       )}
       <div className={`col ${sidebarOpen ? 'col-lg-9' : 'col-lg-12'}`}>
         <button
           className={`btn btn-${sidebarOpen ? 'danger' : 'primary'} mb-3`}
           onClick={() => setSidebarOpen(!sidebarOpen)}
         >
           {sidebarOpen ? 'Hide Measurements' : 'Show Measurements'}
         </button>
         <div className="tree-container p-3 border rounded bg-light">
           <TreeNode 
             ref={treeRef} 
             nodeData={currentTreeData} 
             onNodeChange={addToHistory}
           />
         </div>
       </div>
     </div>
   </div>
 );
}

export default App;