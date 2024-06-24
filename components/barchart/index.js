import React from 'react';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

export default function BarChart() {

  const [ chartData, setChartData ] = useState ({
    datasets: []
  })

  const [ chartOptions, setChartOptions ] = useState ({})

  useEffect(() => {
    setChartData({
      labels: [ 'Pembimbing', 'Jumlah Mahasiswa', 'Jumlah Perempuan', 'Jumlah Laki-Laki'],
      datasets: [
        {
          label: 'users',
          data: [800, 6000, 3500, 2500],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgb(53, 162, 235, 0.4)'
        }
      ]
    }),

    setChartOptions({
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Statistik ',
        },
      },
      responsive: true,
    })
  }, [])
    


  return (
    <>
      <div className='w-[600px] '>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  )
}
