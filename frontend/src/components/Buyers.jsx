import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/buyer";

export default function Buyers() {
    const [buyers, setBuyers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        buyerId: "",
        firstName: "",
        lastName: "",
        title: ""
    });

    useEffect(() => {
        loadBuyers();
    }, []);

    async function loadBuyers() {
        const res = await fetch(`${API_URL}/`);
        if (res.ok) {
            const data = await res.json();
            setBuyers(data);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function openAddForm() {
        setShowForm(true);
        setIsEditing(false);
        setForm({ buyerId: "", firstName: "", lastName: "", title: "" });
    }

    function openEditForm(buyer) {
        setShowForm(true);
        setIsEditing(true);
        setForm({ ...buyer });
    }

    function closeForm() {
        setShowForm(false);
        setIsEditing(false);
        setForm({ buyerId: "", firstName: "", lastName: "", title: "" });
    }

    async function saveBuyer(e) {
        e.preventDefault();
        const url = `${API_URL}/`;

        const payload = {
            buyerId: isEditing ? Number(form.buyerId) : null,
            firstName: form.firstName,
            lastName: form.lastName,
            title: form.title
        };

        console.log("Sending Payload:", payload);

        const res = await fetch(url, {
            method: "PUT", // Matches your @PutMapping
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            await loadBuyers();
            closeForm();
        } else {
            const errorText = await res.text();
            console.error("Server error:", errorText);
            alert("Failed to save buyer. Check console for details.");
        }
    }

    async function deleteBuyer(id) {
        if (!window.confirm("Are you sure?")) return;
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) loadBuyers();
    }

    return (
        <div className="container mt-5">
            <h2>Buyer Management</h2>
            <button onClick={openAddForm} className="btn btn-primary my-2">Add Buyer</button>

            {showForm && (
                <div className="card my-4 border-1 ">
                    <div className="card-header bg-white border-0 py-3">
                        <h5 className="card-title mb-0">
                            {isEditing ? "Update Buyer" : "Add New Buyer"}
                        </h5>
                    </div>
                    <div className="card-body d-flex flex-row px-4 pb-4">
                        <form onSubmit={saveBuyer}>
                            <div className="row g-2">
                                    <label className="form-label fw-bold">First Name</label>
                                    <input
                                        name="firstName"
                                        placeholder="First name"
                                        className="form-control"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-label fw-bold">Last Name</label>
                                    <input
                                        name="lastName"
                                        placeholder="Last name"
                                        className="form-control"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-label fw-bold">Title</label>
                                    <input
                                        name="title"
                                        placeholder="Title"
                                        className="form-control shadow-none"
                                        value={form.title}
                                        onChange={handleChange}
                                    />
                            </div>

                            <div className="mt-4 d-flex gap-2">
                                <button type="submit" className="btn btn-success px-4">
                                    Save Buyer
                                </button>
                                <button type="button" className="btn btn-outline-secondary px-4" onClick={closeForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="table table-hover align-middle mb-0">
                <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {buyers.map((buyer) => (
                    <tr key={buyer.buyerId}>
                        <td>{buyer.firstName}</td>
                        <td>{buyer.lastName}</td>
                        <td>{buyer.title}</td>
                        <td className="container d-flex gap-3">
                            <button onClick={() => openEditForm(buyer)} className="btn btn-outline-secondary">Update</button>
                            <button onClick={() => deleteBuyer(buyer.buyerId)} className="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}