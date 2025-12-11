import { useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    // const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const loginNow = async (e) => {
        e.preventDefault();

        try {
            if (!formData.email || !formData.password) {
                console.error('cannot submit'); 
                return;
            }

            const { data } = await axios.post(
                "http://localhost:5500/auth/login",
                formData
            );

            // Save token & user
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // 🚀 BEST FIX: reliable redirect
            window.location.replace("/dashboard");

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container">
            <div className='row d-flex justify-content-center my-md-5 py-md-5'>

                <div className="col-md-12 text-center">
                    <h1 className='mb-4'>Login</h1>
                </div>

                <div className="col-md-5 bg-light p-4 rounded">

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={loginNow}>

                        <label>Email</label>
                        <input
                            type="email"
                            className='form-control mb-3'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <label>Password</label>
                        <div className="position-relative">
                            <input
                                type={show ? "text" : "password"}
                                className='form-control'
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

                        <button className='btn btn-primary w-100 mt-3' type="submit">
                            Login
                        </button>
                    </form>

                    <p className='text-center mt-4 mb-0'>
                        No Account Yet? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
