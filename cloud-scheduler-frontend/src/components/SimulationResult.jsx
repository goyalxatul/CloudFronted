import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SimulationResult = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("round");
  const [resultData, setResultData] = useState(null);

  const strategyLabels = {
    round: "Round Robin",
    least: "Least Connection",
  };

  const fetchData = async (strategy) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/simulate/${strategy}`
      );
      setResultData({
        strategyName: strategyLabels[strategy],
        makespan: response.data.makespan,
        avgExecTime: response.data.averageExecutionTime,
        cloudletLogs: response.data.cloudletLogs,
      });
    } catch (err) {
      console.error("Error fetching simulation data:", err);
    }
  };

  useEffect(() => {
    fetchData(selectedStrategy);
  }, [selectedStrategy]);

  return (
    <div className="p-6 space-y-6 bg-black text-white">
      <h2 className="text-2xl font-bold text-center">Strategy Simulation Viewer</h2>

      {/* Strategy Selector */}
      <div className="text-center">
        <label htmlFor="strategy" className="mr-2 text-lg font-medium">
          Select Strategy:
        </label>
        <select
          id="strategy"
          className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
        >
          <option value="round">Round Robin</option>
          <option value="least">Least Connection</option>
          <option value="genetic">Genetic Algorithm</option>
        </select>
      </div>

      {/* Show Chart and Logs Only If Data Exists */}
      {resultData && (
        <>
          {/* Bar Chart */}
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[resultData]}>
                <XAxis dataKey="strategyName" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="makespan" fill="#8884d8" name="Makespan" />
                <Bar dataKey="avgExecTime" fill="#82ca9d" name="Avg Execution Time" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cloudlet Logs */}
          <div className="mt-6 border border-gray-600 p-4 rounded shadow bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">{resultData.strategyName} - Cloudlet Logs</h3>
            <ul className="space-y-1 text-sm font-mono max-h-64 overflow-y-auto text-gray-300">
              {resultData.cloudletLogs.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SimulationResult;
