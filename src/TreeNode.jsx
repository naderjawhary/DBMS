import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { fetchSplitCounts } from './api';

const TreeNode = forwardRef((props, ref) => {
  const [measurement, setMeasurement] = useState(null);
  const [threshold, setThreshold] = useState('');
  const leftChildRef = useRef(null);
  const rightChildRef = useRef(null);
  const [splitCounts, setSplitCounts] = useState({ leftCount: 0, rightCount: 0 });

  useEffect(() => {
    if (props.nodeData) {
      setMeasurement(props.nodeData.measurement);
      setThreshold(props.nodeData.threshold?.toString() || '');
    }
  }, [props.nodeData]);

  useEffect(() => {
  const updateSplitCounts = async () => {
    if (measurement && threshold) {
      try {
        console.log('Fetching split counts for:', measurement.id, threshold);
        const counts = await fetchSplitCounts(measurement.id, threshold);
        console.log('Fetched split counts:', counts);
        setSplitCounts(counts);
      } catch (error) {
        console.error('Error fetching split counts:', error);
      }
    }
  };
    updateSplitCounts();
  }, [measurement, threshold]);

  const getNodeData = () => {
    const nodeData = {
      measurement: measurement,
      threshold: threshold ? parseFloat(threshold) : null,
      children: {
        left: leftChildRef.current?.getNodeData() || null,
        right: rightChildRef.current?.getNodeData() || null,
      },
    };
    return nodeData;
  };

  useImperativeHandle(ref, () => ({
    getNodeData,
  }));

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const droppedMeasurement = JSON.parse(e.dataTransfer.getData('measurement'));
      setMeasurement(droppedMeasurement);
    } catch (error) {
      console.error('Error dropping measurement:', error);
    }
  };

  const handleThresholdChange = (e) => {
    setThreshold(e.target.value);
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
        <>
          <div className="text-center mt-3">
            <p>Split Athletes:</p>
            <p>&le; {threshold}: {splitCounts.leftCount}</p>
            <p>&gt; {threshold}: {splitCounts.rightCount}</p>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <div className="text-center text-success">&le; {threshold}</div>
              <TreeNode ref={leftChildRef} nodeData={props.nodeData?.children?.left} />
            </div>
            <div className="col-md-6">
              <div className="text-center text-danger">&gt; {threshold}</div>
              <TreeNode ref={rightChildRef} nodeData={props.nodeData?.children?.right} />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default TreeNode;
