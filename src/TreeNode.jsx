import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {fetchSplitCounts} from './api';

const TreeNode = forwardRef(({ nodeData, onNodeChange, parentSubset = [] }, ref) => {
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
            }
        }, [nodeData]);


        useEffect(() => {
            if (!measurement?.id || !threshold || isLeaf || parentSubset.length === 0) {
                console.warn("Skipping fetchSplitCounts due to missing data", { measurement, threshold, isLeaf, parentSubset });
                return;
            }

            console.log("Triggering fetchSplitCounts with:", { measurement, threshold, parentSubset });

            fetchSplitCounts(measurement.id, threshold, parentSubset.map(a => a._id))
                .then(counts => {
                    console.log("Received splitCounts:", counts);
                    setSplitCounts(counts);
                })
                .catch(error => console.error("Error fetching split counts:", error));
        }, [measurement, threshold, isLeaf, parentSubset]);




        const getNodeData = () => {
            return {
                measurement: measurement,
                threshold: threshold ? parseFloat(threshold) : null,
                isLeaf: isLeaf, // Speichert, ob der Knoten ein Leaf ist
                intervention: intervention, // Speichert den Leaf-Typ ('Yes' oder 'No')
                children: isLeaf ? null : { // Falls der Knoten ein Leaf ist, hat er keine Kinder
                    left: leftChildRef.current?.getNodeData() || null,
                    right: rightChildRef.current?.getNodeData() || null,
                }
            };
        };


        useImperativeHandle(ref, () => ({getNodeData}));

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
                const data = getNodeData();
                console.log('Drop data:', data);
                onNodeChange?.(data);
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

            onNodeChange?.(getNodeData());
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
                                <TreeNode ref={leftChildRef} nodeData={nodeData?.children?.left} parentSubset={leftSubset} />
                            </div>
                            <div className="col-md-6">
                                <div className="text-center text-danger">&gt; {threshold}</div>
                                <TreeNode ref={rightChildRef} nodeData={nodeData?.children?.right} parentSubset={rightSubset} />
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
