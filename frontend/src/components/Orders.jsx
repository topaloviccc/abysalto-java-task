import React, {useEffect, useState} from "react";

const ORDER_API = "http://localhost:8080/api/order";
const BUYER_API = "http://localhost:8080/api/buyer";
const ITEM_API = "http://localhost:8080/api/item";

const ORDER_STATUS_OPTIONS = ["WAITING_FOR_CONFIRMATION",
    "PREPARING",
    "DONE"];
const PAYMENT_OPTIONS = ["CASH",
    "CARD_UPFRONT",
    "CARD_ON_DELIVERY"];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [items, setItems] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [sortOption, setSortOption] = useState("NONE");
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        orderNr: "",
        buyerId: "",
        orderStatus: "WAITING_FOR_CONFIRMATION",
        paymentOption: "CASH",
        contactNumber: "",
        currency: "EUR",
        street: "",
        city: "",
        homeNumber: "",
        orderItems: []
    });

    useEffect(() => {
        loadOrders();
        loadBuyers();
        loadItems();
    }, []);

    async function loadOrders() {
        const res = await fetch(`${ORDER_API}/`);
        if (res.ok) {
            const data = await res.json();
            setOrders(data);
        } else {
            alert("Failed to load orders");
        }
    }

    async function loadBuyers() {
        const res = await fetch(`${BUYER_API}/`);
        if (res.ok) {
            const data = await res.json();
            setBuyers(data);
        } else {
            alert("Failed to load buyers");
        }
    }

    async function loadItems() {
        const res = await fetch(`${ITEM_API}/`);
        if (res.ok) {
            const data = await res.json();
            setItems(data);
        } else {
            alert("Failed to load items");
        }
    }

    function openAddForm() {
        setShowForm(true);
        setIsEditing(false);

        setForm({
            orderNr: "",
            buyerId: "",
            orderStatus: "WAITING_FOR_CONFIRMATION",
            paymentOption: "CASH",
            contactNumber: "",
            currency: "EUR",
            street: "",
            city: "",
            homeNumber: "",
            orderItems: []
        });
    }

    function openEditForm(order) {
        setShowForm(true);
        setIsEditing(true);

        setForm({
            orderNr: order.orderNr,
            buyerId: order.buyer?.buyerId || "",
            orderStatus: order.orderStatus || "WAITING_FOR_CONFIRMATION",
            paymentOption: order.paymentOption || "CASH",
            contactNumber: order.contactNumber || "",
            currency: order.currency || "EUR",
            street: order.deliveryAddress?.street || "",
            city: order.deliveryAddress?.city || "",
            homeNumber: order.deliveryAddress?.homeNumber || "",
            orderItems: (order.orderItems || []).map((it) => ({
                orderItemId: it.orderItemId,
                itemNr: it.itemNr,
                name: it.name,
                price: it.price,
                quantity: it.quantity
            }))
        });
    }

    function closeForm() {
        setShowForm(false);
        setIsEditing(false);
    }

    function handleChange(e) {
        setForm({...form, [e.target.name]: e.target.value});
    }

    function addOrderItem() {
        setForm({
            ...form,
            orderItems: [
                ...form.orderItems,
                {
                    orderItemId: null,
                    itemNr: "",
                    name: "",
                    price: 0,
                    quantity: 1
                }
            ]
        });
    }

    function removeOrderItem(index) {
        const updated = [...form.orderItems];
        updated.splice(index, 1);
        setForm({...form, orderItems: updated});
    }

    function updateOrderItemQuantity(index, value) {
        const updated = [...form.orderItems];
        updated[index].quantity = value;
        setForm({...form, orderItems: updated});
    }

    function selectDropdownItem(index, itemNrValue) {
        // 1. Find the item. Check both item_nr and itemNr just in case
        const selected = items.find(
            (i) => String(i.item_nr || i.itemNr) === String(itemNrValue)
        );

        const updated = [...form.orderItems];

        if (selected) {
            // 2. Use the same key names defined in your form state (itemNr)
            updated[index].itemNr = selected.item_nr || selected.itemNr;
            updated[index].name = selected.name;
            updated[index].price = selected.price;
        } else {
            updated[index].itemNr = "";
            updated[index].name = "";
            updated[index].price = 0;
        }

        setForm({...form, orderItems: updated});
    }

    async function saveOrder(e) {
        e.preventDefault();

        const now = new Date().toISOString().slice(0, 19);

        if (form.orderItems.length === 0) {
            alert("An order must have at least one item!")
            return;
        }

        const payload = {
            orderNr: isEditing ? Number(form.orderNr) : null,

            buyer: {buyerId: Number(form.buyerId)},
            orderStatus: form.orderStatus,
            paymentOption: form.paymentOption,
            contactNumber: form.contactNumber,
            currency: form.currency,
            orderTime: now,
            deliveryAddress: {
                street: form.street,
                city: form.city,
                homeNumber: form.homeNumber
            },

            orderItems: form.orderItems.map((item) => ({
                orderItemId: item.orderItemId || null,
                orderId: isEditing ? Number(form.orderNr) : null,
                itemNr: Number(item.itemNr),
                name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price)
            }))
        };

        const res = await fetch(`${ORDER_API}/`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            await loadOrders();
            closeForm();
        } else {
            const errText = await res.text();
            alert("Failed to save order: " + errText);
        }
    }

    function calculateTotal() {
        let total = 0;

        for (let item of form.orderItems) {
            total += Number(item.price) * Number(item.quantity);
        }

        return total.toFixed(2);
    }

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortOption === "PRICE_ASC") {
            return Number(a.totalPrice) - Number(b.totalPrice);
        }
        if (sortOption === "PRICE_DESC") {
            return Number(b.totalPrice) - Number(a.totalPrice);
        }
        return 0;
    });

    return (
        <div className="container mt-5">
            <h2>Order Management</h2>

            <button onClick={openAddForm} className="btn btn-primary my-2">
                Add Order
            </button>

            {showForm && (
                <div
                    className="card my-4 p-5 border-1"
                >
                    <h2>{isEditing ? "Update Order" : "Add New Order"}</h2>

                    <form className="col-6" onSubmit={saveOrder}>
                        <label className="form-label mt-3">Buyer:</label>
                        <select
                            name="buyerId"
                            value={form.buyerId}
                            onChange={handleChange}
                            className="form-select mb-3"
                            required
                        >
                            <option value="">-- Select Buyer --</option>
                            {buyers.map((b) => (
                                <option key={b.buyerId} value={b.buyerId}>
                                    {b.firstName} {b.lastName}
                                </option>
                            ))}
                        </select>

                        <h4 className="pb-2 mt-3 mb-1">Delivery Address</h4>
                        <label className="form-label">Street:</label>
                        <input
                            className="form-control "
                            type="text"
                            name="street"
                            value={form.street || ""}
                            onChange={(e) => setForm({...form, street: e.target.value})}
                            required
                        />

                        <label className="form-label mt-3">City:</label>
                        <input
                            className="form-control "
                            type="text"
                            name="city"
                            value={form.city || ""}
                            onChange={(e) => setForm({...form, city: e.target.value})}
                            required
                        />

                        <label className="form-label mt-3">Home Number:</label>
                        <input
                            className="form-control "
                            type="text"
                            name="homeNumber"
                            value={form.homeNumber || ""}
                            onChange={(e) => setForm({...form, homeNumber: e.target.value})}
                            required
                        />


                        <h4 className="pb-2 mt-3 mb-1">Payment details</h4>

                        <label className="form-label">Payment Option:</label>
                        <select
                            name="paymentOption"
                            value={form.paymentOption}
                            onChange={handleChange}
                            className="form-select"
                        >
                            {PAYMENT_OPTIONS.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        <label className="form-label mt-3">Currency:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            required
                        />

                        <h4 className="pb-2 mt-3 mb-1">Order details</h4>
                        <label className="form-label">Order Status:</label>
                        <select
                            name="orderStatus"
                            value={form.orderStatus}
                            onChange={handleChange}
                            className="form-select"
                        >
                            {ORDER_STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <label className="form-label mt-3">Contact Number:</label>
                        <input
                            className="form-control "
                            type="text"
                            name="contactNumber"
                            value={form.contactNumber}
                            onChange={handleChange}
                            required
                        />

                        <hr/>
                        <h4>Order Items</h4>

                        {form.orderItems.length === 0 && (
                            <p>No items added yet.</p>
                        )}

                        {form.orderItems.map((item, index) => (
                            <div
                                key={index}
                                className="bg-light p-4 mb-3 rounded-1"
                            >
                                <label className="form-label mt-3">Item:</label>
                                <select
                                    value={item.itemNr || ""}
                                    className="form-select"
                                    onChange={(e) => selectDropdownItem(index, e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Item --</option>
                                    {items.map((i) => {
                                        const id = i.item_nr || i.itemNr;
                                        return (
                                            <option key={id} value={String(id)}>
                                                {id} - {i.name} ({i.price})
                                            </option>
                                        );
                                    })}
                                    required
                                </select>

                                <label className="form-label mt-3">Quantity:</label>
                                <input
                                    className="form-control "
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateOrderItemQuantity(index, e.target.value)
                                    }
                                    required
                                />

                                <p style={{marginTop: "10px"}}>
                                    <b>Price:</b> {item.price}
                                </p>

                                <p>
                                    <b>Subtotal:</b>{" "}
                                    {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => removeOrderItem(index)}
                                    className="btn btn-danger"
                                >
                                    Remove Item
                                </button>
                            </div>
                        ))}

                        <button type="button" onClick={addOrderItem} className="btn btn-outline-primary">
                            + Add Item
                        </button>

                        <hr/>

                        <h4>Total: {calculateTotal()}</h4>

                        <button type="submit" className="btn btn-success px-4 me-2">
                            Save
                        </button>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="btn btn-outline-secondary px-4"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <h3>Order List</h3>

            <div className="d-flex justify-content-end mb-3">
                <select
                    className="form-select w-auto"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="NONE">No Sorting</option>
                    <option value="PRICE_ASC">Total Price (Low -> High)</option>
                    <option value="PRICE_DESC">Total Price (High -> Low)</option>
                </select>
            </div>
            <table className="table table-hover align-middle mb-0">
                <thead>
                <tr>
                    <th>Order Nr</th>
                    <th>Buyer</th>
                    <th>Order status</th>
                    <th>Order time</th>
                    <th>Payment method</th>
                    <th>Delivery address</th>
                    <th>Contact</th>
                    <th>Total Price</th>
                    <th>Items ordered</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan="8" style={{textAlign: "center"}}>
                            No orders found
                        </td>
                    </tr>
                ) : (
                    sortedOrders.map((o) => (
                        <tr key={o.orderNr}>
                            <td>{o.orderNr}</td>
                            <td>
                                {o.buyer?.firstName} {o.buyer?.lastName}
                            </td>
                            <td>{o.orderStatus}</td>
                            <td>{o.orderTime}</td>
                            <td>{o.paymentOption}</td>
                            <td>{o.deliveryAddress.street} {o.deliveryAddress.homeNumber}, {o.deliveryAddress.city} </td>
                            <td>{o.contactNumber}</td>

                            <td>{o.totalPrice} {o.currency}</td>
                            <td>
                                {o.orderItems && o.orderItems.length > 0 ? (
                                    o.orderItems.map((it) => (
                                        <div key={it.orderItemId}>
                                            {it.name} ({it.quantity} x {it.price} {o.currency})
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-muted">No items</span>
                                )}
                            </td>
                            <td>
                                <button onClick={() => openEditForm(o)} className="btn btn-outline-secondary">Update
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}