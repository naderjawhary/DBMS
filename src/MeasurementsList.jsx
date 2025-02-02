import React, { useEffect, useState } from 'react';

function MeasurementsList() {
  const [measurements, setMeasurements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/measurements');
        if (!response.ok) {
          throw new Error('Failed to fetch measurements');
        }
        const data = await response.json();
        setMeasurements(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMeasurements();
  }, []);

  const handleDragStart = (e, measurement) => {
    e.dataTransfer.setData('measurement', JSON.stringify(measurement));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Measurements</h5>
      </div>
      <div className="card-body">
        {error ? (
          <p className="text-danger">{error}</p>
        ) : measurements.length > 0 ? (
          <ul className="list-group">
            {measurements.map((measurement) => (
              <li
                key={measurement.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, measurement)}
              >
                {measurement.name} {measurement.name !== "Gender" && <>({measurement.unit})</>}
                <span className="badge bg-secondary">Drag</span>
              </li>
            ))}
          </ul>
        ) : (
            <p>Loading measurements...</p>
        )}
      </div>
    </div>
  );
}

export default MeasurementsList;
