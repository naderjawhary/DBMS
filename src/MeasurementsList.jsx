import React from 'react'

const measurements = [
  { id: 1, name: 'Height', unit: 'cm' },
  { id: 2, name: 'Weight', unit: 'kg' },
  { id: 3, name: 'Speed', unit: 'm/s' },
  { id: 4, name: 'Vertical Jump', unit: 'cm' },
  { id: 5, name: 'Endurance', unit: 'points' }
]

function MeasurementsList() {
  const handleDragStart = (e, measurement) => {
    e.dataTransfer.setData('measurement', JSON.stringify(measurement))
  }

  return (
    <div className="measurements-panel">
      <h2>Measurements</h2>
      <div className="measurements-list">
        {measurements.map(measurement => (
          <div 
            key={measurement.id} 
            className="measurement-item"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, measurement)}
          >
            {measurement.name} ({measurement.unit})
          </div>
        ))}
      </div>
    </div>
  )
}

export default MeasurementsList