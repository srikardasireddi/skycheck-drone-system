import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newComments, setNewComments] = useState('');

  // 1. READ - Fetch all items when page loads
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/checklist');
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // 2. CREATE - Add a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newTask) return;

    try {
      await axios.post('http://localhost:5000/api/checklist', {
        task_name: newTask,
        status: 'Pending',
        comments: newComments
      });
      setNewTask('');
      setNewComments('');
      fetchItems(); // Refresh list
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // 3. UPDATE - Change Status
  const handleStatusChange = async (id, currentStatus, currentTask, currentComments) => {
    let newStatus = 'Pending';
    if (currentStatus === 'Pending') newStatus = 'Go';
    else if (currentStatus === 'Go') newStatus = 'No-Go';
    else newStatus = 'Pending';

    try {
      await axios.put(`http://localhost:5000/api/checklist/${id}`, {
        task_name: currentTask, // Keep name same
        status: newStatus,
        comments: currentComments // Keep comments same
      });
      fetchItems();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 4. DELETE - Remove item
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this check?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/checklist/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🚁 SkyCheck: Drone Safety System</h1>
        <p>Flight Control ID: SKY-2025-OP-01</p>
      </header>

      {/* INPUT FORM */}
      <div className="add-form">
        <input 
          type="text" 
          placeholder="New Check (e.g. Check Battery Voltage)" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Comments (Optional)" 
          value={newComments}
          onChange={(e) => setNewComments(e.target.value)}
        />
        <button onClick={handleAddItem}>+ Add Check</button>
      </div>

      {/* CHECKLIST TABLE */}
      <table>
        <thead>
          <tr>
            <th>Check Description</th>
            <th>Status (Click to Change)</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.task_name}</td>
              <td>
                <button 
                  className={`status-btn status-${item.status.toLowerCase()}`} 
                  onClick={() => handleStatusChange(item.id, item.status, item.task_name, item.comments)}
                >
                  {item.status}
                </button>
              </td>
              <td>{item.comments}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;