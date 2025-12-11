import React, { useEffect, useState } from 'react';
import axios from 'axios';

const priorityColors = {
    low: "badge bg-success",
    medium: "badge bg-primary",
    high: "badge bg-warning text-dark",
    urgent: "badge bg-danger"
};

const statusColors = {
    pending: "badge bg-secondary",
    in_progress: "badge bg-info text-dark",
    completed: "badge bg-success",
    cancelled: "badge bg-dark"
};

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        team: "",
        assignedTo: ""
    });

    const user = JSON.parse(localStorage.getItem("user"));

    // Format Name
    const capitalizedName = user?.name
        ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
        : "User";

    // Fetch Tasks
    const getTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://taskbackend-4gzx.onrender.com/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data.tasks);
        } catch (err) {
            console.log("Error loading tasks", err);
        }
    };

    // Fetch Teams
    const getTeams = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://taskbackend-4gzx.onrender.com/teams", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(res.data.teams);
        } catch (err) {
            console.log("Error loading teams", err);
        }
    };

    // Fetch Users
    const getUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://taskbackend-4gzx.onrender.com/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users);
        } catch (err) {
            console.log("Error loading users", err);
        }
    };

    useEffect(() => {
        getTasks();
        getTeams();
        getUsers();
    }, []);

    // Create task
    const handleCreateTask = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "https://taskbackend-4gzx.onrender.com/tasks",
                newTask,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Task Created Successfully!");
            setShowForm(false);

            setNewTask({
                title: "",
                description: "",
                priority: "",
                dueDate: "",
                team: "",
                assignedTo: ""
            });

            getTasks();
        } catch (err) {
            console.log(err);
            alert("Failed to create task");
        }
    };

    // Auto-select team for Team Leader
    useEffect(() => {
        if (user?.role === "team_leader") {
            setNewTask((prev) => ({ ...prev, team: user.team }));
        }
    }, [user]);

    return (
        <div className="container py-4">

            {/* TOP BAR */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-0">Dashboard</h2>
                    <small className="text-muted">
                        👋 Hi, <strong>{capitalizedName}</strong>
                    </small>
                </div>

                <div className="d-flex align-items-center gap-2">

                    {(user?.role === "admin" || user?.role === "team_leader") && (
                        <button
                            className="btn btn-dark px-4"
                            onClick={() => setShowForm(true)}
                        >
                            + New Task
                        </button>
                    )}

                    <button
                        className="btn btn-outline-danger px-4"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.replace("/login");
                        }}
                    >
                        Logout
                    </button>

                </div>
            </div>

            {/* CREATE TASK FORM */}
            {showForm && (
                <div className="card p-4 mb-4 shadow-sm rounded-4">
                    <h5 className="fw-bold mb-3">Create New Task</h5>

                    <input
                        type="text"
                        placeholder="Task Title"
                        className="form-control mb-2"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />

                    <textarea
                        placeholder="Task Description"
                        className="form-control mb-2"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />

                    <select
                        className="form-control mb-2"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        <option value="">Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    {/* TEAM DROPDOWN */}
                    {user?.role === "admin" && (
                        <select
                            className="form-control mb-2"
                            value={newTask.team}
                            onChange={(e) => setNewTask({ ...newTask, team: e.target.value })}
                        >
                            <option value="">Select Team</option>
                            {teams.map((t) => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    )}

                    {user?.role === "team_leader" && (
                        <input
                            className="form-control mb-2"
                            value="Your Team (Auto-selected)"
                            disabled
                        />
                    )}

                    {/* ASSIGN USER */}
                    <select
                        className="form-control mb-2"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    >
                        <option value="">Assign User</option>

                        {users
                            .filter(u => u.team === newTask.team)
                            .map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                    </select>

                    <input
                        type="date"
                        className="form-control mb-3"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />

                    <button onClick={handleCreateTask} className="btn btn-success">
                        Create Task
                    </button>

                    <button
                        className="btn btn-secondary ms-2"
                        onClick={() => setShowForm(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* TASK GRID */}
            <div className="row g-4">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task._id} className="col-lg-4 col-md-6 col-sm-12">

                        <div className="card border-0 shadow-sm p-3 rounded-4">

                            <div className="d-flex justify-content-between align-items-start">
                                <h5 className="fw-bold mb-1">{task.title}</h5>
                                <span className={priorityColors[task.priority]}>
                                    {task.priority}
                                </span>
                            </div>

                            <p className="text-muted small mb-2">{task.description}</p>

                            <span className={statusColors[task.status]}>
                                {task.status.replace("_", " ")}
                            </span>

                            <hr />

                            <p><strong>👤 Assigned:</strong> {task.assignedTo?.name}</p>
                            <p><strong>🧩 Team:</strong> {task.team?.name}</p>
                            <p><strong>📅 Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>

                        <div className="mt-2 text-end mt-4">
                            <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                            <button className="btn btn-sm btn-outline-danger ml-2">Delete</button>
                            <button className="btn btn-sm btn-outline-success ml-2">View</button>
                        </div>
                    </div>
                )) : (
                    <h5 className="opacity-50 text-center mt-5">No tasks available</h5>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
