import { ApexOptions } from 'apexcharts';
import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartRange = 'hari' | 'minggu' | 'bulan';

const chartViews: Record<
  ChartRange,
  {
    label: string;
    period: string;
    categories: string[];
    max: number;
    series: {
      name: string;
      data: number[];
    }[];
  }
> = {
  hari: {
    label: 'Hari',
    period: 'Senin, 14 September 2026',
    categories: ['08.00', '10.00', '12.00', '14.00', '16.00'],
    max: 120,
    series: [
      {
        name: 'Total HPS',
        data: [25, 40, 72, 96, 118],
      },
      {
        name: 'Hasil Negosiasi',
        data: [22, 36, 66, 88, 109],
      },
    ],
  },
  minggu: {
    label: 'Minggu',
    period: '8 - 14 September 2026',
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    max: 260,
    series: [
      {
        name: 'Total HPS',
        data: [85, 120, 72, 185, 96, 140, 220],
      },
      {
        name: 'Hasil Negosiasi',
        data: [78, 112, 68, 172, 89, 132, 205],
      },
    ],
  },
  bulan: {
    label: 'Bulan',
    period: 'Januari - Desember 2026',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ],
    max: 400,
    series: [
      {
        name: 'Total HPS',
        data: [85, 120, 185, 140, 220, 160, 275, 342, 190, 235, 128, 310],
      },
      {
        name: 'Hasil Negosiasi',
        data: [78, 112, 172, 132, 205, 151, 258, 319, 176, 221, 119, 292],
      },
    ],
  },
};

const baseOptions: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: chartViews.bulan.categories,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value) => `Rp ${value} jt`,
    },
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 400,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const [activeRange, setActiveRange] = useState<ChartRange>('bulan');
  const [state, setState] = useState<ChartOneState>({
    series: chartViews.bulan.series,
  });
  const activeView = chartViews[activeRange];

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      ...baseOptions,
      xaxis: {
        ...baseOptions.xaxis,
        categories: activeView.categories,
      },
      yaxis: {
        ...baseOptions.yaxis,
        max: activeView.max,
      },
    }),
    [activeView]
  );

  const handleRangeChange = (range: ChartRange) => {
    setActiveRange(range);
    setState({ series: chartViews[range].series });
  };

  const rangeButtons: ChartRange[] = ['hari', 'minggu', 'bulan'];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total HPS</p>
              <p className="text-sm font-medium">{activeView.period}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Hasil Negosiasi</p>
              <p className="text-sm font-medium">{activeView.period}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {rangeButtons.map((range) => {
              const isActive = activeRange === range;

              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleRangeChange(range)}
                  className={`rounded px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white'
                      : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark'
                  }`}
                >
                  {chartViews[range].label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            key={activeRange}
            options={chartOptions}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
