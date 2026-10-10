import { useState } from "react";
import {
 BarChart,
 Bar,
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer
} from "recharts";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  
  const totalVehicles = data
  ? data.vehicle_totals.car +
    data.vehicle_totals.motorcycle +
    data.vehicle_totals.bus +
    data.vehicle_totals.truck
  : 0;

const chartData = data
  ? [
      {
        name: "Cars",
        count: data.vehicle_totals.car,
        percentage: totalVehicles
        ? ((data.vehicle_totals.car / totalVehicles) * 100).toFixed(1)
        : 0
      },
      {
        name: "Motorcycles",
        count: data.vehicle_totals.motorcycle,
        percentage: totalVehicles
        ? ((data.vehicle_totals.motorcycle / totalVehicles) * 100).toFixed(1)
        : 0
      },
      {
        name: "Buses",
        count: data.vehicle_totals.bus,
        percentage: totalVehicles
        ? ((data.vehicle_totals.bus / totalVehicles) * 100).toFixed(1)
        : 0
      },
      {
        name: "Trucks",
        count: data.vehicle_totals.truck,
        percentage: totalVehicles
        ? ((data.vehicle_totals.truck / totalVehicles) * 100).toFixed(1)
        : 0
      },
    ]
  : [];
const historyChartData = history.map((item) => ({
  name: `Run ${item.runNumber}`,
  average: item.average_vehicles_per_frame,
  trafficLevel: item.traffic_level,
  greenTime: item.green_time
}));

const latestAnalysis = history.length > 0
  ? history[history.length - 1]
  : null;

const aiDecisionMessage = latestAnalysis
 ? latestAnalysis.traffic_level === "HIGH"
 ? `HIGH traffic detected (${latestAnalysis.average_vehicles_per_frame} vehicles/frame). AI recommends extending the green signal to ${latestAnalysis.green_time} seconds instead of the fixed ${latestAnalysis.fixed_signal_time} seconds.`
 : latestAnalysis.traffic_level === "MEDIUM"
 ? `MEDIUM traffic detected (${latestAnalysis.average_vehicles_per_frame} vehicles/frame). AI recommends a ${latestAnalysis.green_time}-second green signal based on current traffic demand.`
 : `LOW traffic detected (${latestAnalysis.average_vehicles_per_frame} vehicles/frame). AI recommends a ${latestAnalysis.green_time}-second green signal because traffic demand is low.`
 : "";

  const runAnalysis = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/traffic-analysis"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch traffic analysis");
      }

      const result = await response.json();
      setData(result);

      setHistory((previousHistory) => [
      ...previousHistory,
     {
      ...result,
      runNumber: previousHistory.length + 1
     }
     ]);
    } catch (err) {
      setError(
        "Unable to connect to the traffic analysis backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
  if (!data) {
    return;
  }

  const rows = [
    ["Metric", "Value"],
    ["Video", data.video],
    ["Frames Processed", data.frames_processed],
    ["Total Vehicle Detections", data.total_vehicle_detections],
    ["Cars", data.vehicle_totals.car],
    ["Motorcycles", data.vehicle_totals.motorcycle],
    ["Buses", data.vehicle_totals.bus],
    ["Trucks", data.vehicle_totals.truck],
    ["Average Vehicles Per Frame", data.average_vehicles_per_frame],
    ["Traffic Level", data.traffic_level],
    ["Fixed Signal Time (seconds)", data.fixed_signal_time],
    ["Recommended Green Time (seconds)", data.green_time],
    [
      "Timing Difference (seconds)",
      data.green_time - data.fixed_signal_time
    ],
    [
      "Emergency Priority",
      data.emergency_priority.priority ? "ACTIVE" : "NORMAL"
    ]
  ];

  const csvContent = rows
    .map((row) =>
      row
        .map((value) =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "traffic-analysis-report.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
 };
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>AI Traffic Flow Optimization</h1>
          <p>Intelligent Traffic Monitoring & Signal Optimization</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Backend Online
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard">

        {/* Welcome Section */}
        <section className="hero">
          <div>
            <h2>Traffic Control Dashboard</h2>
            <p>
              Analyse traffic using AI-powered vehicle detection
              and dynamically recommend signal timing.
            </p>
          </div>

          <button
            className="analyse-btn"
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? "Analysing Traffic..." : "Run Traffic Analysis"}
          </button>
          {data && (
           <button
            onClick={downloadReport}
            className="download-report-button"
            >
           📥 Download Analysis Report (CSV)
           </button>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Dashboard Cards */}
        <section className="cards">

          <div className="card">
            <div className="card-title">🚗 Cars</div>
            <div className="card-value">
              {data ? data.vehicle_totals.car : "--"}
            </div>
            <div className="card-label">
              Vehicle detections
            </div>
          </div>

          <div className="card">
            <div className="card-title">🏍️ Motorcycles</div>
            <div className="card-value">
              {data ? data.vehicle_totals.motorcycle : "--"}
            </div>
            <div className="card-label">
              Vehicle detections
            </div>
          </div>

          <div className="card">
            <div className="card-title">🚌 Buses</div>
            <div className="card-value">
              {data ? data.vehicle_totals.bus : "--"}
            </div>
            <div className="card-label">
              Vehicle detections
            </div>
          </div>

          <div className="card">
            <div className="card-title">🚛 Trucks</div>
            <div className="card-value">
              {data ? data.vehicle_totals.truck : "--"}
            </div>
            <div className="card-label">
              Vehicle detections
            </div>
          </div>

        </section>

        {latestAnalysis && (
          <section className="comparison-panel">
          <h3>Fixed vs Dynamic Signal</h3>

          <div className="comparison-grid">

          <div className="comparison-card">
          <span>Fixed Signal</span>
           <strong>
            {latestAnalysis.fixed_signal_time} sec
           </strong>
          <p>Traditional fixed-time control</p>
          </div>

          <div className="comparison-card dynamic">
          <span>AI Dynamic Signal</span>
          <strong>
           {latestAnalysis.green_time} sec
          </strong>
          <p>Traffic-demand based control</p>
          </div>

          <div className="comparison-card difference">
          <span>Difference</span>
           <strong>
             {latestAnalysis.green_time -
             latestAnalysis.fixed_signal_time > 0
             ? "+"
             : ""}
            {latestAnalysis.green_time -
             latestAnalysis.fixed_signal_time}{" "}
             sec
           </strong>
          <p>Recommended timing adjustment</p>
          </div>

          </div>
          </section>
       )}

        {/* Vehicle Distribution */}
        <section className="chart-panel">
          <h3>Vehicle Distribution</h3>

          {data ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip
                 content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) {
                     return null;
                  }

                const item = payload[0].payload;

                return (
                <div
                 style={{
                 background: "#ffffff",
                 border: "1px solid #c8eab4",
                 borderRadius: "10px",
                 padding: "12px"
                 }}
                >
                <strong>{item.name}</strong>

                <p>
                 Average Traffic:{" "}
                 <strong>{item.average} vehicles/frame</strong>
                </p>

                <p>
                 Traffic Level:{" "}
                 <strong>{item.trafficLevel}</strong>
                </p>

               <p>
               Green Time:{" "}
               <strong>{item.greenTime} seconds</strong>
               </p>
               </div>
                );
                }}
                />
               <Bar
                dataKey="count"
                fill="#72c94b"
                radius={[8, 8, 0, 0]}
                 />
              </BarChart>
           </ResponsiveContainer>
           ) : (
           <div className="chart-empty">
             Run traffic analysis to view vehicle distribution.
           </div>
            )}
        </section>
        <section className="chart-panel">
         <h3>Analysis History</h3>

          {history.length > 0 ? (
          <div>
            {history.map((item) => (
            <div
               key={item.runNumber}
               style={{
               padding: "15px",
               marginBottom: "10px",
               background: "#f7fff3",
               border: "1px solid #c8eab4",
               borderRadius: "12px"
               }}
              >
              <strong>Run {item.runNumber}</strong>

              <p>
                Traffic Level: <strong>{item.traffic_level}</strong>
              </p>

             <p>
              Average Vehicles/Frame:{" "}
              <strong>{item.average_vehicles_per_frame}</strong>
             </p>

             <p>
              Recommended Green Time:{" "}
             <strong>{item.green_time} seconds</strong>
             </p>
            </div>
            ))}
            </div>
           ) : (
          <div className="chart-empty">
            Run traffic analysis to create history.
          </div>
          )}
        </section>
        <section className="chart-panel">
         <h3>Traffic Trend</h3>

         {historyChartData.length > 0 ? (
         <ResponsiveContainer width="100%" height={300}>
         <LineChart data={historyChartData}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="name" />
           <YAxis />
           <Tooltip
             formatter={(value) => [
              `${value} vehicles/frame`,
               "Average Traffic"
             ]}
           />
           <Line
            type="monotone"
            dataKey="average"
            stroke="#72c94b"
            strokeWidth={3}
            dot={{ r: 5 }}
           />
         </LineChart>
         </ResponsiveContainer>
          ) : (
         <div className="chart-empty">
           Run traffic analysis to view traffic trends.
         </div>
         )}
        </section>

        {/* Traffic Overview */}
        <section className="overview">

          <div className="panel">
            <h3>Traffic Overview</h3>

            <div className="metric">
              <span>Frames Processed</span>
              <strong>
                {data ? data.frames_processed : "--"}
              </strong>
           </div>

            <div className="metric">
              <span>Total Vehicle Detections</span>
              <strong>
                {data ? data.total_vehicle_detections : "--"}
              </strong>
            </div>

            <div className="metric">
              <span>Average Vehicles / Frame</span>
              <strong>
                {data ? data.average_vehicles_per_frame : "--"}
              </strong>
            </div>
          </div>

          <div className="panel signal-panel">
            <h3>AI Signal Recommendation</h3>

            <div className="traffic-level">  
              <div className="traffic-signal">
                <div
                  className={`signal-light red ${
                  data?.traffic_level === "LOW" ? "active" : ""
                  }`}
               ></div>

                <div
                 className={`signal-light yellow ${
                 data?.traffic_level === "MEDIUM" ? "active" : ""
                 }`}
               ></div>

                <div
                 className={`signal-light green ${
                 data?.traffic_level === "HIGH" ? "active" : ""
                 }`}
               ></div>
              </div>

              <div className="signal-status">
               <span>Current Signal</span>
               <strong>
                 {data?.traffic_level === "LOW"
                 ? "RED"
                 : data?.traffic_level === "MEDIUM"
                 ? "YELLOW"
                 : data?.traffic_level === "HIGH"
                 ? "GREEN"
                  : "--"}
               </strong>
              </div>

              <div className="signal-time">
                Recommended Green Time:{" "}
                <strong>
                 {data ? data.green_time : "--"} seconds
                </strong>
              </div>

              <div className="emergency-status">
               <div>
                <span>🚑 Emergency Priority</span>
                 <strong>
                  {data?.emergency_priority?.priority
                  ? "ACTIVE"
                  : "NORMAL"}
                 </strong>
                </div>

               <p>
               {data?.emergency_priority?.message ||
                "Waiting for traffic analysis"}
               </p>
              </div>
              <span>Traffic Level</span>

              <strong
                className={
                  data?.traffic_level === "HIGH"
                    ? "high"
                    : "normal"
                }
              >
                {data ? data.traffic_level : "--"}
              </strong>
            </div>
            {data && (
             <div className="density-meter">
               <div className="density-header">
                 <span>Traffic Density</span>
                 <strong>{data.average_vehicles_per_frame}</strong>
                </div>

               <div className="density-bar">
                 <div
                   className="density-fill"
                    style={{
                     width: `${Math.min(
                     data.average_vehicles_per_frame * 8,
                      100
                      )}%`
                      }}
                 ></div>
               </div>

               <div className="density-scale">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
               </div>
             </div>
                )}

            <div className="green-light">
              <div className="signal-circle"></div>

              <div>
                <span>Recommended Green Time</span>
                <strong>
                  {data ? `${data.green_time} sec` : "--"}
                </strong>
              </div>
            </div>
          </div>

        </section>

        {/* System Architecture */}
        <section className="architecture">
          <h3>AI Traffic Optimization Pipeline</h3>

          <div className="pipeline">

            <div className="pipeline-item">
              <span>📹</span>
              <p>Traffic Video</p>
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <span>🤖</span>
              <p>YOLO Detection</p>
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <span>🚗</span>
              <p>Vehicle Counting</p>
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <span>📊</span>
              <p>Traffic Level</p>
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <span>🚦</span>
              <p>Signal Timing</p>
            </div>

          </div>
        </section>

      </main>

      <footer>
        AI-Powered Traffic Flow Optimization System
      </footer>

    </div>
  );
}

export default App;