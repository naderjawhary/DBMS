import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {fetchSplitCounts} from './api';

const TreeNode = forwardRef(
    ({nodeData, onNodeChange, onMeasurementDrop, parentSubset = []}, ref) => {
        const [measurement, setMeasurement] = useState(null);
        const [threshold, setThreshold] = useState('');
        const [isLeaf, setIsLeaf] = useState(false);
        const [intervention, setIntervention] = useState('');
        const [leftSubset, setLeftSubset] = useState([]);
        const [rightSubset, setRightSubset] = useState([]);
        const [splitCounts, setSplitCounts] = useState({leftCount: 0, rightCount: 0});
        const leftChildRef = useRef(null);
        const rightChildRef = useRef(null);


        useEffect(() => {
            if (nodeData) {
                setMeasurement(nodeData.measurement);
                setThreshold(nodeData.threshold?.toString() || '');
                setIsLeaf(nodeData.isLeaf || false);
                setIntervention(nodeData.intervention || '');

                if (nodeData.splitCounts) {
                    setSplitCounts(nodeData.splitCounts);
                } else if (nodeData.measurement?.id && nodeData.threshold && parentSubset.length > 0) {
                    fetchSplitCounts(nodeData.measurement.id, nodeData.threshold, parentSubset.map((a) => a._id))
                        .then((counts) => {
                            setSplitCounts(counts);
                        })
                        .catch((error) => console.error('Error fetching split counts:', error));
                }
            }
        }, [nodeData, parentSubset]);

        useEffect(() => {
            if (!measurement?.id || !threshold || isLeaf || parentSubset.length === 0) return;

            fetchSplitCounts(measurement.id, threshold, parentSubset.map((a) => a._id))
                .then((counts) => {
                    setSplitCounts(counts);
                })
                .catch((error) => console.error('Error fetching split counts:', error));
        }, [measurement, threshold, isLeaf, parentSubset]);

        const getNodeData = () => {
            return {
                measurement,
                threshold: threshold ? parseFloat(threshold) : null,
                isLeaf,
                intervention,
                children: isLeaf
                    ? null
                    : {
                        left: leftChildRef.current?.getNodeData() || null,
                        right: rightChildRef.current?.getNodeData() || null,
                    },
                splitCounts,
            };
        };

        useImperativeHandle(ref, () => ({
            getNodeData,
        }));

        const handleSetLeaf = (value) => {
            setIsLeaf(true);
            setIntervention(value);
            setMeasurement(null);
            setThreshold('');
            onNodeChange?.(getNodeData()); // Notify parent of change
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
                onNodeChange?.(getNodeData()); // Notify parent of change
            } catch (error) {
                console.error('Error dropping measurement:', error);
            }
        };

        const handleThresholdChange = (e) => {
            const newThreshold = e.target.value;
            setThreshold(newThreshold);

            if (!measurement || !newThreshold || parentSubset.length === 0) return;

            const leftSubset = parentSubset.filter((athlete) =>
                athlete.measurements.some((m) => m.id === measurement.id && m.value <= newThreshold)
            );
            const rightSubset = parentSubset.filter((athlete) =>
                athlete.measurements.some((m) => m.id === measurement.id && m.value > newThreshold)
            );

            setLeftSubset(leftSubset);
            setRightSubset(rightSubset);

            onNodeChange?.(getNodeData()); // Notify parent of change
        };

        const handleChildChange = () => {
            onNodeChange?.(getNodeData()); // Notify parent of change
        };

        return (
            <div className="card shadow-sm mb-3">
                <div
                    className={`card-body ${!measurement && !isLeaf ? 'bg-light text-muted' : ''}`}
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
                                {measurement.name !== "Gender" && <span className="text-muted">({measurement.unit})</span>}
                            </div>
                            <input
                                type="number"
                                className="form-control mt-2"
                                placeholder="Enter threshold..."
                                value={threshold}
                                onChange={handleThresholdChange}
                                // hidden={measurement.name === "Gender"}
                            />
                        </>
                    )}
                </div>

                {!isLeaf && measurement && threshold && (
                    <>
                        <div className="row mt-3">
                            <div className="text-center">Split Athletes:</div>
                            <div className="col-md-6">
                                <div className="text-center text-success">
                                    {measurement?.name === "Gender"
                                        ? (threshold === "0" ? "Male" : "Female")
                                        : `≤ ${threshold}`
                                    }: {splitCounts.leftCount}
                                </div>
                                <TreeNode
                                    ref={leftChildRef}
                                    nodeData={nodeData?.children?.left}
                                    parentSubset={leftSubset}
                                    onNodeChange={handleChildChange} // Propagate child changes
                                    onMeasurementDrop={onMeasurementDrop}
                                />
                            </div>
                            <div className="col-md-6">
                                <div className="text-center text-danger">
                                    {measurement?.name === "Gender"
                                        ? (threshold === "0" ? "Female" : "Male")
                                        : `> ${threshold}`
                                    }: {splitCounts.rightCount}
                                </div>

                                <TreeNode
                                    ref={rightChildRef}
                                    nodeData={nodeData?.children?.right}
                                    parentSubset={rightSubset}
                                    onNodeChange={handleChildChange} // Propagate child changes
                                    onMeasurementDrop={onMeasurementDrop}
                                />
                            </div>
                        </div>
                    </>
                )}

                {!measurement && !isLeaf && (
                    <div className="text-center mt-3 mb-2">
                        <button className="btn btn-success me-2" onClick={() => handleSetLeaf('Yes')}>
                            Intervention: Yes
                        </button>
                        <button className="btn btn-danger" onClick={() => handleSetLeaf('No')}>
                            Intervention: No
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

export default TreeNode;