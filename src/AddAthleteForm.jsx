import React, { useState } from 'react';

function AddAthleteForm() {
  const [athlete, setAthlete] = useState({
    name: '',
    measurements: [
      { id: 1, name: 'Weight', value: '', unit: 'kg' },
      { id: 2, name: 'Height', value: '', unit: 'cm' },
      { id: 3, name: 'BMI', value: '', unit: 'kg/m²' },
      { id: 4, name: 'Speed', value: '', unit: 'm/s' },
      { id: 5, name: 'Jump distance', value: '', unit: 'cm' },
      { id: 6, name: 'Age', value: '', unit: 'years' },
      { id: 7, name: 'Gender', value: '', unit: '' },
    ],
  });

  const handleMeasurementChange = (id, key, value) => {
    setAthlete((prev) => ({
      ...prev,
      measurements: prev.measurements.map((measurement) =>
        measurement.id === id ? { ...measurement, [key]: value } : measurement
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preparedAthlete = {
      ...athlete,
      measurements: athlete.measurements.map((measurement) => ({
        ...measurement,
        value: measurement.name === 'Gender' ? Number(measurement.value) : Number(measurement.value) || null,
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedAthlete),
      });

      if (response.ok) {
        alert('Athlete added successfully!');
        setAthlete({
          name: '',
          measurements: [
            { id: 1, name: 'Weight', value: '', unit: 'kg' },
            { id: 2, name: 'Height', value: '', unit: 'cm' },
            { id: 3, name: 'BMI', value: '', unit: 'kg/m²' },
            { id: 4, name: 'Speed', value: '', unit: 'm/s' },
            { id: 5, name: 'Jump distance', value: '', unit: 'cm' },
            { id: 6, name: 'Age', value: '', unit: 'years' },
            { id: 7, name: 'Gender', value: '', unit: '' },
          ],
        });
      } else {
        throw new Error('Failed to add athlete');
      }
    } catch (error) {
      console.error('Error adding athlete:', error);
      alert('Error adding athlete. Please check the data and try again.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Add New Athlete</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={athlete.name}
            onChange={(e) => setAthlete({ ...athlete, name: e.target.value })}
            required
          />
        </div>

        {/* Measurements */}
        <h3 className="mb-3">Measurements</h3>
        {athlete.measurements.map((measurement) => (
          <div className="mb-3" key={measurement.id}>
            <label className="form-label">
              {measurement.name} ({measurement.unit || 'N/A'})
            </label>
            {measurement.name === 'Gender' ? (
              <select
                className="form-select"
                value={measurement.value}
                onChange={(e) => handleMeasurementChange(measurement.id, 'value', e.target.value)}
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            ) : (
              <input
                type="number"
                className="form-control"
                value={measurement.value}
                onChange={(e) => handleMeasurementChange(measurement.id, 'value', e.target.value)}
                required
              />
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-primary">Add Athlete</button>
      </form>
    </div>
  );
}

export default AddAthleteForm;