import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member'
    });
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.table(formData)
        e.preventDefault();
        try {
            await axios.post('https://taskbackend-4gzx.onrender.com/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center mb-md-5 py-md-5">

                <div className="col-md-12 text-center">
                    <h1 className="mb-4">Create Account</h1>
                </div>

                <div className="col-md-5 bg-light p-4 rounded">

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>

                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control mb-3"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <label>Password</label>
                        <div style={{position:'relative'}}>
                            <input
                                type={show ? "text" : "password"}
                                className="form-control mb-3"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <span
                                onClick={() => setShow(!show)}
                                style={{ position: "absolute", right: 10, top: 8, cursor: 'pointer' }}
                            >
                                {show ? "🙈" : "👁️"}
                            </span>
                        </div>

                        <label>Role</label>
                        <select
                            className="form-control mb-4"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Member">Member</option>
                            <option value="TeamLeader">Team Leader</option>
                        </select>

                        <button type="submit" className="btn btn-success w-100">
                            Register
                        </button>
                    </form>

                    <p className="text-center mt-4 mb-0">
                        Already have  Account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );


}

export default Register;