import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {fetchSplitCounts} from './api';

const TreeNode = forwardRef(({ nodeData, onNodeChange, parentSubset = [], onMeasurementDrop }, ref) => {
        const [measurement, setMeasurement] = useState(null);
        const [threshold, setThreshold] = useState('');
        const [isLeaf, setIsLeaf] = useState(false);
        const [intervention, setIntervention] = useState(''); // Yes / No
        const leftChildRef = useRef(null);
        const rightChildRef = useRef(null);
        const [leftSubset, setLeftSubset] = useState([]);
        const [rightSubset, setRightSubset] = useState([]);
        const [splitCounts, setSplitCounts] = useState({leftCount: 0, rightCount: 0});


 useEffect(() => {
   if (nodeData) {
     setMeasurement(nodeData.measurement);
     setThreshold(nodeData.threshold?.toString() || '');
     setIsLeaf(nodeData.isLeaf !== undefined ? nodeData.isLeaf : false);
     setIntervention(nodeData.intervention || '');
     if (nodeData.splitCounts) {
                    setSplitCounts(nodeData.splitCounts);
                } else if (nodeData.measurement?.id && nodeData.threshold && parentSubset.length > 0) {
                    // 🔥 Falls keine gespeicherten `splitCounts` existieren, rufen wir `fetchSplitCounts` erneut auf
                    fetchSplitCounts(nodeData.measurement.id, nodeData.threshold, parentSubset.map(a => a._id))
                        .then(counts => {
                            console.log("Fetched splitCounts for loaded tree:", counts);
                            setSplitCounts(counts);
                        })
                        .catch(error => console.error("Error fetching split counts for loaded tree:", error));
                }
   } else {
      setMeasurement(null);
      setThreshold('');
    }
 }, [nodeData]);

 const getNodeData = () => {
     if (!measurement) return null;
   const nodeData = {
     measurement: measurement,
     threshold: threshold ? parseFloat(threshold) : null,
       isLeaf: isLeaf, // Speichert, ob der Knoten ein Leaf ist
       intervention: intervention, // Speichert den Leaf-Typ ('Yes' oder 'No')
     children: isLeaf ? null : {
       left: leftChildRef.current?.getNodeData() || null,
       right: rightChildRef.current?.getNodeData() || null
     }
   };
   return nodeData;
 };

 useImperativeHandle(ref, () => ({
   getNodeData,
         getCurrentMeasurement: () => measurement
 }));

 const handleSetLeaf = (value) => {
            setIsLeaf(true);
            setIntervention(value);
            setMeasurement(null);
            setThreshold('');
            onNodeChange?.(getNodeData());
        };

 const handleDragOver = (e) => {
   e.preventDefault();
 };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const droppedMeasurement = JSON.parse(e.dataTransfer.getData('measurement'));
      setMeasurement(droppedMeasurement);

      onMeasurementDrop?.(droppedMeasurement);

      const completeNodeData = {
        measurement: droppedMeasurement,
        threshold: threshold ? parseFloat(threshold) : null,
        children: {
          left: leftChildRef.current?.getNodeData() || null,
          right: rightChildRef.current?.getNodeData() || null
        }
      };
      onNodeChange?.(completeNodeData);
    } catch (error) {
      console.error('Error dropping measurement:', error);
    }
  };

  const handleThresholdChange = (e) => {
    const newThreshold = e.target.value;
    setThreshold(newThreshold);

        if (!measurement || !newThreshold || parentSubset.length === 0) return;

    const leftSubset = parentSubset.filter(athlete =>
        athlete.measurements.some(m => m.id === measurement.id && m.value <= newThreshold)
    );
    const rightSubset = parentSubset.filter(athlete =>
        athlete.measurements.some(m => m.id === measurement.id && m.value > newThreshold)
    );

    setLeftSubset(leftSubset);
    setRightSubset(rightSubset);

    const completeNodeData = {
      measurement: measurement,
      threshold: newThreshold ? parseFloat(newThreshold) : null,
      children: {
        left: leftChildRef.current?.getNodeData() || null,
        right: rightChildRef.current?.getNodeData() || null
      }
    };
    onNodeChange?.(completeNodeData); //getNodeData()
  };

        return (
            <div className="card shadow-sm mb-3">
                <div
                    className={`card-body ${!measurement ? 'bg-light text-muted' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {!measurement && !isLeaf ? (
                        <div className="text-center">Drop measurement here</div>
                    ) : isLeaf ? (
                        <div className="text-center">
                            <strong>Intervention: {intervention}</strong>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>{measurement.name}</strong>
                                <span className="text-muted">({measurement.unit})</span>
                            </div>
                            <input
                                type="number"
                                className="form-control mt-2"
                                placeholder="Enter threshold..."
                                value={threshold}
                                onChange={handleThresholdChange}
                                onBlur={() => {
                                    const data = getNodeData();
                                    onNodeChange?.(data);
                                }}
                            />
                        </>
                    )}
                </div>

                {!isLeaf && measurement && threshold && (
                    <>
                        <div className="text-center mt-3">
                            <p>Split Athletes:</p>
                            <p>&le; {threshold}: {splitCounts.leftCount}</p>
                            <p>&gt; {threshold}: {splitCounts.rightCount}</p>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6">
                                <div className="text-center text-success">&le; {threshold}</div>
                                <TreeNode ref={leftChildRef} nodeData={nodeData?.children?.left} parentSubset={leftSubset} onMeasurementDrop={onMeasurementDrop}/>
                            </div>
                            <div className="col-md-6">
                                <div className="text-center text-danger">&gt; {threshold}</div>
                                <TreeNode ref={rightChildRef} nodeData={nodeData?.children?.right} parentSubset={rightSubset} onMeasurementDrop={onMeasurementDrop}/>
                            </div>
                        </div>
                    </>
                )}
                {!measurement && !isLeaf && (
                    <div className="text-center mt-3">
                        <button className="btn btn-success me-2" onClick={() => handleSetLeaf('Yes')}>Intervention: Yes</button>
                        <button className="btn btn-danger" onClick={() => handleSetLeaf('No')}>Intervention: No</button>
                    </div>
                )}
            </div>
        );
    })
;

export default TreeNode;