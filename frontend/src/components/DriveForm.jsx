import React, { useState } from 'react';

function DriveForm({ onAddDrive }) {
  const [driveName, setDriveName] = useState('');
  const [venue, setVenue] = useState('');
  const [donorCount, setDonorCount] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!driveName.trim() || !venue.trim() || donorCount === '') {
      alert('Please fill in all required fields.');
      return;
    }

    if (Number(donorCount) < 0 || !Number.isInteger(Number(donorCount))) {
      alert('Donor count must be a non-negative whole number.');
      return;
    }

    onAddDrive({
      driveName: driveName.trim(),
      venue: venue.trim(),
      donorCount: Number(donorCount),
      completed,
    });

    setDriveName('');
    setVenue('');
    setDonorCount('');
    setCompleted(false);
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 text-danger">Add a Donation Drive</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Drive Name *</label>
              <input
                type="text"
                className="form-control"
                value={driveName}
                onChange={(e) => setDriveName(e.target.value)}
                maxLength={100}
                required
                placeholder="e.g. Community Blood Drive"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Venue *</label>
              <input
                type="text"
                className="form-control"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                maxLength={150}
                required
                placeholder="e.g. Community Hall"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Donor Count *</label>
              <input
                type="number"
                className="form-control"
                value={donorCount}
                onChange={(e) => setDonorCount(e.target.value)}
                min="0"
                step="1"
                required
                placeholder="Enter number of donors"
              />
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <div className="form-check mt-4">
                <input
                  id="completed"
                  type="checkbox"
                  className="form-check-input"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="completed">
                  Drive completed
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-danger mt-4">
            Add Drive
          </button>
        </form>
      </div>
    </div>
  );
}

export default DriveForm;