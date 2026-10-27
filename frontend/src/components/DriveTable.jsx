import React from 'react';

function DriveTable({ drives, onDeleteDrive, onEditDrive }) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 text-danger">Donation Drives</h5>
      </div>

      <div className="card-body">
        {drives.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <h6>No donation drives found</h6>
            <p className="mb-0">Add a drive to see it listed here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-danger">
                <tr>
                  <th>ID</th>
                  <th>Drive Name</th>
                  <th>Venue</th>
                  <th>Donors</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((drive) => (
                  <tr key={drive.id}>
                    <td>{drive.id}</td>
                    <td className="fw-semibold">{drive.driveName}</td>
                    <td>{drive.venue}</td>
                    <td>{drive.donorCount}</td>
                    <td>
                      <span
                        className={`badge ${
                          drive.completed ? 'text-bg-success' : 'text-bg-warning'
                        }`}
                      >
                        {drive.completed ? 'Completed' : 'Ongoing'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEditDrive(drive)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDeleteDrive(drive.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriveTable;