import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";

const TasksSection = () => {
  const { tasks, fetchTasks } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [fetchTasks, selectedDate]);

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem("token");

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const token = getToken();
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/taskManager/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let updatedTasks = response.data.tasks.map(task =>
        task._id === taskId ? { ...task, done: !currentStatus } : task
      );

      await axios.post(
        "http://localhost:5000/taskManager",
        { date: selectedDate, tasks: updatedTasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTasks(selectedDate);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    const token = getToken();
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/taskManager/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let updatedTasks = response.data.tasks || [];
      updatedTasks.push({ description: newTask, done: false });

      await axios.post(
        "http://localhost:5000/taskManager",
        { date: selectedDate, tasks: updatedTasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewTask("");
      fetchTasks(selectedDate);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Daily Tasks</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      {tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="p-3 border-b last:border-none flex justify-between">
              <span className={`font-medium ${task.done ? "line-through text-gray-500" : ""}`}>
                {task.description}
              </span>
              <button
                className={`px-4 py-1 rounded-lg text-white ${task.done ? "bg-green-500" : "bg-gray-400"}`}
                onClick={() => toggleTaskStatus(task._id, task.done)}
              >
                {task.done ? "Done" : "Not Done"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tasks for this day</p>
      )}
    </div>
  );
};

export default TasksSection;
 