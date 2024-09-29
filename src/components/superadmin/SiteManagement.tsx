import { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  TooltipItem,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

interface GenderStats {
  male: number;
  female: number;
  others: number;
}

interface VisitStats {
  dailyVisits: { date: string; count: number }[];
  monthlyVisits: { month: string; count: number }[];
}

interface AgeStats {
  ageGroups: { [key: string]: number };
}

const SiteManagement = () => {
  const [genderStats, setGenderStats] = useState<GenderStats>({ male: 0, female: 0, others: 0 });
  const [visitStats, setVisitStats] = useState<VisitStats>({ dailyVisits: [], monthlyVisits: [] });
  const [ageStats, setAgeStats] = useState<AgeStats>({ ageGroups: {} });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/visit-stats");

        // Log the response data to verify the structure
        console.log('Response from /api/visit-stats:', response.data);

        // Set visit statistics
        setVisitStats(response.data);

        // Set dummy gender and age stats for demo purposes
        setGenderStats({ male: 120, female: 100, others: 30 });
        setAgeStats({ ageGroups: { "0-18": 30, "19-25": 120, "26-35": 200, "36-45": 150, "46-60": 100, "60+": 50 } });
      } catch (error) {
        console.error("Error fetching site stats:", error);
        setError("Failed to load site statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const genderData = {
    labels: ["Male", "Female", "Others"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [genderStats.male, genderStats.female, genderStats.others],
        backgroundColor: ["blue", "pink", "gray"],
        borderWidth: 1,
      },
    ],
  };

  const tooltipCallback = (tooltipItem: TooltipItem<'pie'>) => {
    const dataIndex = tooltipItem.dataIndex;
    const gender = genderData.labels[dataIndex];
    const count = genderData.datasets[0].data[dataIndex] as number;
    return `${gender}: ${count}`;
  };

  const dailyVisitData = {
    labels: visitStats.dailyVisits.map(v => v.date),
    datasets: [
      {
        label: "Daily Visits",
        data: visitStats.dailyVisits.map(v => v.count),
        fill: false,
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  };

  const monthlyVisitData = {
    labels: visitStats.monthlyVisits.map(v => v.month),
    datasets: [
      {
        label: "Monthly Visits",
        data: visitStats.monthlyVisits.map(v => v.count),
        backgroundColor: "green",
        borderWidth: 1,
      },
    ],
  };

  const ageDistributionData = {
    labels: Object.keys(ageStats.ageGroups),
    datasets: [
      {
        label: "Age Distribution",
        data: Object.values(ageStats.ageGroups),
        backgroundColor: "purple",
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Site Management</h2>

      {/* Gender Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <div className="border-2 p-4 rounded-lg">
          <Pie 
            data={genderData} 
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: tooltipCallback,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Daily Visits */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Daily Visits</h3>
        <div className="border-2 p-4 rounded-lg">
          <Line data={dailyVisitData} />
        </div>
      </div>

      {/* Monthly Visits */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Monthly Visits</h3>
        <div className="border-2 p-4 rounded-lg">
          <Bar data={monthlyVisitData} />
        </div>
      </div>

      {/* Age Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
        <div className="border-2 p-4 rounded-lg">
          <Bar data={ageDistributionData} />
        </div>
      </div>
    </div>
  );
};

export default SiteManagement;
