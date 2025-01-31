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
 const [suggestions, setSuggestions] = useState([]);
 const [lastDroppedMeasurement, setLastDroppedMeasurement] = useState(null);

 const analyzeTrees = async () => {
   try {
       const response = await api.get('/trees');
       const allTrees = response.data;
       
       const patterns = {
           commonMeasurements: {},
           commonThresholds: {},
           measurementPairs: {}
       };

       allTrees.forEach(tree => {
           const measurements = [];
           
           const analyzeNode = (node) => {
               if (!node || !node.measurement) return;
               
               const measurementName = node.measurement.name;
               measurements.push(measurementName);
               
               patterns.commonMeasurements[measurementName] = 
                   (patterns.commonMeasurements[measurementName] || 0) + 1;

               if (!patterns.commonThresholds[measurementName]) {
                   patterns.commonThresholds[measurementName] = [];
               }
               if (node.threshold) {
                   patterns.commonThresholds[measurementName].push(node.threshold);
               }

               if (node.children) {
                   analyzeNode(node.children.left);
                   analyzeNode(node.children.right);
               }
           };

           analyzeNode(tree.rootNode);

           measurements.forEach((measurement, i) => {
               if (!patterns.measurementPairs[measurement]) {
                   patterns.measurementPairs[measurement] = {};
               }
               
               if (measurements[i + 1]) {
                   const nextMeasurement = measurements[i + 1];
                   patterns.measurementPairs[measurement][nextMeasurement] = 
                       (patterns.measurementPairs[measurement][nextMeasurement] || 0) + 1;
               }
           });
       });

       return patterns;
   } catch (error) {
       console.error('Error analyzing trees:', error);
       return null;
   }
 };

 const getSuggestions = async (currentMeasurement = null) => {
   const patterns = await analyzeTrees();
   if (!patterns) return [];
   
   let suggestions = [];

   if (currentMeasurement) {
       const pairs = patterns.measurementPairs[currentMeasurement];
       if (pairs) {
           suggestions = Object.entries(pairs)
               .sort(([,a], [,b]) => b - a)
               .slice(0, 3)
               .map(([measurement, frequency]) => ({
                   measurement,
                   frequency,
                   suggestedThreshold: patterns.commonThresholds[measurement]?.length > 0
                       ? (patterns.commonThresholds[measurement].reduce((a, b) => a + b, 0) / 
                          patterns.commonThresholds[measurement].length).toFixed(1)
                       : null,
                   type: 'next-in-sequence'
               }));
       }
   }

   if (suggestions.length < 3) {
       const generalSuggestions = Object.entries(patterns.commonMeasurements)
           .sort(([,a], [,b]) => b - a)
           .filter(([measurement]) => 
               !suggestions.some(s => s.measurement === measurement))
           .slice(0, 3 - suggestions.length)
           .map(([measurement, frequency]) => ({
               measurement,
               frequency,
               suggestedThreshold: patterns.commonThresholds[measurement]?.length > 0
                   ? (patterns.commonThresholds[measurement].reduce((a, b) => a + b, 0) / 
                      patterns.commonThresholds[measurement].length).toFixed(1)
                   : null,
               type: 'popular'
           }));
           
       suggestions = [...suggestions, ...generalSuggestions];
   }

   return suggestions;
 };

 const handleMeasurementDrop = (measurement) => {
   setLastDroppedMeasurement(measurement.name);
   updateSuggestions(measurement.name);
 };

 const updateSuggestions = async (measurementName) => {
   const newSuggestions = await getSuggestions(measurementName);
   setSuggestions(newSuggestions);
 };

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
           className="btn btn-info me-2" 
           onClick={redo}
           disabled={currentIndex >= history.length - 1}
         >
           Redo
         </button>
         <button 
           className="btn btn-secondary" 
           onClick={async () => updateSuggestions(lastDroppedMeasurement)}
         >
           Get Suggestions
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

     {suggestions.length > 0 && (
       <div className="row mb-4">
         <div className="col">
           <div className="p-3 bg-light border rounded">
             <h5>Suggestions based on your current tree:</h5>
             <ul className="list-unstyled">
               {suggestions.map((s, i) => (
                 <li key={i} className="mb-2">
                   <strong>{s.measurement}</strong>
                   {s.suggestedThreshold && 
                     ` (Suggested threshold: ${s.suggestedThreshold})`}
                   <small className="text-muted d-block">
                     {s.type === 'next-in-sequence' 
                       ? `Commonly used after ${lastDroppedMeasurement}` 
                       : 'Popular measurement'} 
                     - Used {s.frequency} times
                   </small>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     )}

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
             onMeasurementDrop={handleMeasurementDrop}
           />
         </div>
       </div>
     </div>
   </div>
 );
}

export default App;