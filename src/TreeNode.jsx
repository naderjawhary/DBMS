import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

const TreeNode = forwardRef(({ nodeData, onNodeChange, onMeasurementDrop }, ref) => {
  const [measurement, setMeasurement] = useState(null);
  const [threshold, setThreshold] = useState('');
  const leftChildRef = useRef(null);
  const rightChildRef = useRef(null);

  useEffect(() => {
    if (nodeData) {
      setMeasurement(nodeData.measurement);
      setThreshold(nodeData.threshold?.toString() || '');
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
      children: {
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
    
    const completeNodeData = {
      measurement: measurement,
      threshold: newThreshold ? parseFloat(newThreshold) : null,
      children: {
        left: leftChildRef.current?.getNodeData() || null,
        right: rightChildRef.current?.getNodeData() || null
      }
    };
    onNodeChange?.(completeNodeData);
  };

  return (
    <div className="card shadow-sm mb-3">
      <div
        className={`card-body ${!measurement ? 'bg-light text-muted' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!measurement ? (
          <div className="text-center">Drop measurement here</div>
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
            />
          </>
        )}
      </div>

      {measurement && threshold && (
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="text-center text-success">&le; {threshold}</div>
            <TreeNode 
              ref={leftChildRef} 
              nodeData={nodeData?.children?.left}
              onNodeChange={() => {
                const completeNodeData = getNodeData();
                onNodeChange?.(completeNodeData);
              }}
              onMeasurementDrop={onMeasurementDrop}
            />
          </div>
          <div className="col-md-6">
            <div className="text-center text-danger">&gt; {threshold}</div>
            <TreeNode 
              ref={rightChildRef} 
              nodeData={nodeData?.children?.right}
              onNodeChange={() => {
                const completeNodeData = getNodeData();
                onNodeChange?.(completeNodeData);
              }}
              onMeasurementDrop={onMeasurementDrop}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default TreeNode;