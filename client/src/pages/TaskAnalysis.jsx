import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskAnalysis = () => {
  const [taskData, setTaskData] = useState([]); // Holds all date-wise task details

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    const token = localStorage.getItem("token"); // Retrieve JWT token

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/taskManager/getall/all", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      setTaskData(response.data || []);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Task Analysis (Date-wise)</h2>

      {taskData.length > 0 ? (
        taskData.map(({ date, tasks }) => {
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter((task) => task.done).length;
          const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <div key={date} className="mb-6 p-4 border rounded-lg shadow">
              <div className="text-lg font-semibold bg-gray-100 p-4 rounded-lg">
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Total Tasks:</strong> {totalTasks}</p>
                <p><strong>Completion Rate:</strong> {completionRate.toFixed(2)}%</p>
              </div>

              {/* Task List */}
              {tasks.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {tasks.map((task, index) => (
                    <li key={index} className="p-3 border-b last:border-none flex justify-between">
                      <span className={`font-medium ${task.done ? "line-through text-gray-500" : ""}`}>
                        {task.description}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-lg ${
                        task.done ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                      }`}>
                        {task.done ? "Completed" : "Pending"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-4">No tasks recorded for this day</p>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 mt-4">No task data available</p>
      )}
    </div>
  );
};

export default TaskAnalysis;
