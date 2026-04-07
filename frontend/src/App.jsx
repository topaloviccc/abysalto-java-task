import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Buyers from "./components/Buyers";
import Orders from "./components/Orders";

export default function App() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-secondary px-3">
                    <Link className="navbar-brand" to="/">
                        Ordering platform
                    </Link>

                    <div className="navbar-nav">
                        <Link className="nav-link" to="/buyers">
                            Buyers
                        </Link>

                        <Link className="nav-link" to="/orders">
                            Orders
                        </Link>
                    </div>
                </nav>

                <div className="container mt-4">
                    <Routes>
                        <Route path="/buyers" element={<Buyers />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/" element={
                            <div className="p-5">
                                <h1 className="display-4">Restaurant ordering platform, place an order online</h1>
                                <p className="lead">Restaurant order management system</p>
                                <hr />
                                <div className="d-flex justify-content-center gap-3">
                                    <Link to="/buyers" className="btn btn-primary btn-lg">Manage Buyers</Link>
                                    <Link to="/orders" className="btn btn-outline-dark btn-lg">Manage Orders</Link>
                                </div>
                            </div>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}