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

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5500/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data.tasks);
        } catch (err) {
            console.log("Error loading tasks", err);
        }
    };

    return (
        <div className="container py-4">

            {/* Top Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Dashboard</h2>
                <button className="btn btn-dark px-4">+ New Task</button>
            </div>

            {/* Task Grid */}
            <div className="row g-4">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task._id} className="col-lg-4 col-md-6 col-sm-12">
                        <div className="card border-0 shadow-sm p-3 rounded-4"
                            style={{ transition: "0.2s", cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>

                            <div className="d-flex justify-content-between align-items-start">
                                <h5 className="fw-bold mb-1">{task.title}</h5>
                                <span className={priorityColors[task.priority] || "badge bg-secondary"}>
                                    {task.priority}
                                </span>
                            </div>

                            <p className="text-muted small mb-2">{task.description}</p>

                            <span className={statusColors[task.status] || "badge bg-secondary"}>
                                {task.status.replace("_", " ")}
                            </span>

                            <hr />

                            <p className="mb-1"><strong>👤 Assigned:</strong> {task.assignedTo?.name}</p>
                            <p className="mb-1"><strong>🧩 Team:</strong> {task.team?.name}</p>
                            <p className="mb-0"><strong>📅 Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                )) :
                    <h5 className="opacity-50 text-center mt-5">No tasks available</h5>}
            </div>
        </div>
    );
};

export default Dashboard;
