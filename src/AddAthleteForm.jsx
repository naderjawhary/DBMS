import React, { useState } from 'react';

function AddAthleteForm() {
  const [athlete, setAthlete] = useState({
    name: '',
    age: '',
    gender: '',
    measurements: [
      { id: 1, name: 'Weight', value: '', unit: 'kg' },
      { id: 2, name: 'Height', value: '', unit: 'cm' },
      { id: 3, name: 'BMI', value: '', unit: 'kg/m²' },
      { id: 4, name: 'Speed', value: '', unit: 'm/s' },
      { id: 5, name: 'Jump distance', value: '', unit: 'cm' },
    ],
  });

const handleInputChange = (field, value) => {
  setAthlete((prev) => ({
    ...prev,
    [field]: field === 'gender' && value !== "" ? Number(value) : value
  }));
};


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

  if (athlete.gender === null || athlete.gender === "" || isNaN(athlete.gender)) {
    alert("Please select a valid gender.");
    return;
  }

  const preparedAthlete = {
    ...athlete,
    age: Number(athlete.age),
    measurements: athlete.measurements.map((measurement) => ({
      ...measurement,
      value: measurement.value ? Number(measurement.value) : null,
    })),
  };

  try {
    // API-Aufruf
    const response = await fetch('http://localhost:5000/api/athletes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preparedAthlete),
    });


    if (response.ok) {
      alert('Athlete added successfully!');
      // Formular zurücksetzen
      setAthlete({
        name: '',
        age: '',
        gender: null,
        measurements: [
          { id: 1, name: 'Weight', value: '', unit: 'kg' },
          { id: 2, name: 'Height', value: '', unit: 'cm' },
          { id: 3, name: 'BMI', value: '' },
          { id: 4, name: 'Speed', value: '', unit: 'm/s' },
          { id: 5, name: 'Jump distance', value: '', unit: 'cm' },
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
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input
              type="number"
              className="form-control"
              id="age"
              value={athlete.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
              className="form-select"
              id="gender"
              value={athlete.gender ?? ""} // Verhindere, dass es auf "0" oder "1" zurückfällt
              onChange={(e) => handleInputChange('gender', e.target.value)}
              required>
            <option value="" disabled>
              Select Gender
            </option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>


        {/* Measurements */}
        <h3 className="mb-3">Measurements</h3>
        {athlete.measurements.map((measurement) => (
            <div className="mb-3" key={measurement.id}>
              <label className="form-label">
                {measurement.name} ({measurement.unit || 'N/A'})
              </label>
              <input
                  type="number"
                  className="form-control"
                  value={measurement.value}
                  onChange={(e) =>
                      handleMeasurementChange(measurement.id, 'value', e.target.value)
                  }
                  required
              />
            </div>
        ))}

        <button type="submit" className="btn btn-primary">
          Add Athlete
        </button>
      </form>
    </div>
  );
}

export default AddAthleteForm;
