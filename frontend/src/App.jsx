import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8081/blooddonationdrive';

const emptyForm = {
  driveName: '',
  venue: '',
  donorCount: '',
  completed: false,
};

function App() {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showAll, setShowAll] = useState(true);

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const loadDrives = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/displayAll`);
      setDrives(response.data);
      setShowAll(true);
    } catch (err) {
      setError(
        'Unable to load drives. Check whether the Spring Boot backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.driveName.trim()) {
      setError('Please enter the drive name.');
      return false;
    }

    if (!form.venue.trim()) {
      setError('Please enter the venue.');
      return false;
    }

    if (
      form.donorCount === '' ||
      !Number.isInteger(Number(form.donorCount)) ||
      Number(form.donorCount) < 0
    ) {
      setError('Donor count must be a non-negative whole number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!validateForm()) return;

    const payload = {
      driveName: form.driveName.trim(),
      venue: form.venue.trim(),
      donorCount: Number(form.donorCount),
      completed: form.completed,
    };

    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/update/${editingId}`, payload);
        setMessage('Blood donation drive updated successfully.');
      } else {
        await axios.post(`${API_URL}/add`, payload);
        setMessage('Blood donation drive added successfully.');
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadDrives();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Operation failed. Please check the backend and try again.'
      );
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!searchId.trim() || !/^\d+$/.test(searchId.trim())) {
      setError('Please enter a valid numeric drive ID.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/display/${searchId.trim()}`
      );

      setDrives([response.data]);
      setShowAll(false);
      setMessage(`Drive with ID ${searchId} found.`);
    } catch (err) {
      setDrives([]);
      setShowAll(false);
      setError(
        err.response?.data?.message ||
          `Drive with ID ${searchId} was not found.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drive) => {
    clearMessages();
    setEditingId(drive.id);

    setForm({
      driveName: drive.driveName ?? '',
      venue: drive.venue ?? '',
      donorCount: String(drive.donorCount ?? ''),
      completed: Boolean(drive.completed),
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    clearMessages();
  };

  const handleDelete = async (id) => {
    clearMessages();

    if (!window.confirm(`Are you sure you want to delete drive ${id}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setMessage(`Drive ${id} deleted successfully.`);

      if (!showAll && searchId.trim() === String(id)) {
        setSearchId('');
      }

      await loadDrives();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to delete drive ${id}.`
      );
    }
  };

  const handleShowAll = async () => {
    clearMessages();
    setSearchId('');
    await loadDrives();
  };

  return (
    <div className="app-background min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">
            BloodConnect
          </a>

          <span className="navbar-text text-white">
            Blood Donation Drive Management
          </span>
        </div>
      </nav>

      <header id="home" className="hero-section text-center text-white py-5">
        <div className="container">
          <span className="hero-icon"></span>
          <h1 className="display-5 fw-bold mt-3">
            Every Drop Counts
          </h1>
          <p className="lead mb-0">
            Organize blood donation drives. Help save lives.
          </p>
        </div>
      </header>

      <main className="container py-5">
        {message && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="status"
          >
            {message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setMessage('')}
            />
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setError('')}
            />
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <section className="card border-0 shadow-sm form-card">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h2 className="h4 fw-bold mb-1">
                  {editingId !== null ? 'Update Drive' : 'Register a Drive'}
                </h2>
                <p className="text-secondary small mb-0">
                  {editingId !== null
                    ? `Editing drive ID ${editingId}`
                    : 'Enter the blood donation drive details.'}
                </p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="driveName" className="form-label fw-semibold">
                      Drive Name
                    </label>
                    <input
                      id="driveName"
                      name="driveName"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Campus Blood Donation Camp"
                      value={form.driveName}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="venue" className="form-label fw-semibold">
                      Venue
                    </label>
                    <input
                      id="venue"
                      name="venue"
                      type="text"
                      className="form-control"
                      placeholder="Enter the venue"
                      value={form.venue}
                      onChange={handleChange}
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="donorCount" className="form-label fw-semibold">
                      Donor Count
                    </label>
                    <input
                      id="donorCount"
                      name="donorCount"
                      type="number"
                      min="0"
                      step="1"
                      className="form-control"
                      placeholder="Number of donors"
                      value={form.donorCount}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-check form-switch mb-4">
                    <input
                      id="completed"
                      name="completed"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.completed}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="completed">
                      Drive completed
                    </label>
                  </div>

                  <button type="submit" className="btn btn-danger w-100 fw-semibold">
                    {editingId !== null ? 'Save Changes' : 'Add Drive'}
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      onClick={cancelEdit}
                    >
                      Cancel Update
                    </button>
                  )}
                </form>
              </div>
            </section>

            <section className="card border-0 shadow-sm mt-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold">Find a Drive</h2>
                <p className="text-secondary small">
                  Search for a specific donation drive by its ID.
                </p>

                <form onSubmit={handleSearch}>
                  <div className="input-group">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Enter drive ID"
                      aria-label="Drive ID"
                      value={searchId}
                      onChange={(event) => setSearchId(event.target.value)}
                    />
                    <button className="btn btn-dark" type="submit">
                      Search
                    </button>
                  </div>
                </form>

                <button
                  type="button"
                  className="btn btn-outline-danger w-100 mt-3"
                  onClick={handleShowAll}
                >
                  View All Drives
                </button>
              </div>
            </section>
          </div>

          <div className="col-lg-8">
            <section className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <h2 className="h4 fw-bold mb-1">
                      {showAll ? 'Donation Drives' : 'Search Results'}
                    </h2>
                    <p className="text-secondary small mb-0">
                      {drives.length} {drives.length === 1 ? 'drive' : 'drives'} displayed
                    </p>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={handleShowAll}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-secondary mt-2 mb-0">Loading drives...</p>
                  </div>
                ) : drives.length === 0 ? (
                  <div className="text-center py-5 px-3">
                    <div className="empty-icon mb-3"></div>
                    <h3 className="h5">No donation drives found</h3>
                    <p className="text-secondary mb-0">
                      Add a drive or search using another ID.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3">ID</th>
                          <th>Drive Name</th>
                          <th>Venue</th>
                          <th>Donors</th>
                          <th>Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {drives.map((drive) => (
                          <tr key={drive.id}>
                            <td className="ps-3 fw-semibold">{drive.id}</td>
                            <td className="fw-semibold">{drive.driveName}</td>
                            <td>{drive.venue}</td>
                            <td>{drive.donorCount}</td>
                            <td>
                              <span
                                className={`badge ${
                                  drive.completed
                                    ? 'text-bg-success'
                                    : 'text-bg-warning'
                                }`}
                              >
                                {drive.completed ? 'Completed' : 'Upcoming'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(drive)}
                                  title={`Update drive ${drive.id}`}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(drive.id)}
                                  title={`Delete drive ${drive.id}`}
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
            </section>

            <div className="row g-3 mt-2">
              <div className="col-sm-4">
                <div className="stat-card">
                  <div className="stat-number">{drives.length}</div>
                  <div className="stat-label">Displayed Drives</div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="stat-card">
                  <div className="stat-number">
                    {drives.reduce(
                      (total, drive) => total + Number(drive.donorCount || 0),
                      0
                    )}
                  </div>
                  <div className="stat-label">Displayed Donors</div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="stat-card">
                  <div className="stat-number">
                    {drives.filter((drive) => drive.completed).length}
                  </div>
                  <div className="stat-label">Completed Drives</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-4 mt-4">
        <div className="container">
          <p className="fw-semibold mb-1">BloodConnect</p>
          <p className="small text-white-50 mb-0">
            Blood Donation Drive Management System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
