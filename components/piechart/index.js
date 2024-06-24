import Chart from "chart.js/auto";
import React, { useRef, useEffect } from "react";
import useSWR from "swr";

export default function PieChart() {
  const canvas = useRef();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data : tables =[], error } = useSWR('/api/admin/thirdQuery', fetcher);

  useEffect(() => {
    const ctx = canvas.current;

    let chartStatus = Chart.getChart(ctx);
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Sisdamas", "Terpadu", "Tematik", "Kolaborasi Mandiri", "Nusantara", "Luar Negeri"],
        datasets: [
          {
            label: "Mahasiswa",
            data: [2625, 975, 875, 775, 373, 375, ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Jenis KKN 2024 UIN SGD Bandung"
          }
        }
      }
    });
  }, []);

  return (
    <div className="w-[450px]">
      <canvas id="myChart" ref={canvas}></canvas>
    </div>
  );
}
