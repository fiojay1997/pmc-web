import ReactECharts from 'echarts-for-react';

const gaugeData = [
  {
    value: 20,
    name: 'Course Average',
    title: {
      offsetCenter: ['-100%', '84%'],
    },
    detail: {
      offsetCenter: ['-80%', '115%'],
    },
    itemStyle: {
      color: '#568EA6 ',
    },
  },
  {
    value: 60,
    name: 'Major Average',
    title: {
      offsetCenter: ['100%', '84%'],
    },
    detail: {
      offsetCenter: ['80%', '115%'],
    },
    itemStyle: {
      color: '#F18C8E',
    },
  },
];
let option = {
  series: [
    {
      type: 'gauge',

      anchor: {
        show: true,
        showAbove: true,
        size: 8,
        itemStyle: {
          color: '#568EA6',
        },
      },
      pointer: {
        show: true,
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
        distance: 50,
      },

      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#464646',
        },
      },
      axisLine: {
        roundCap: true,
      },
      data: gaugeData,
      title: {
        fontSize: 12,
      },
      detail: {
        width: 40,
        height: 14,
        fontSize: 14,
        color: '#fff',
        backgroundColor: 'auto',
        borderRadius: 3,
        formatter: (value) => generateLetterGrade(value),
      },
    },
  ],
};
function generateLetterGrade(value) {
  value /= 25;
  if (value >= (3.7 + 4) / 2) return 'A';
  if (value >= (3.3 + 3.7) / 2) return 'A-';
  if (value >= (3 + 3.3) / 2) return 'B+';
  if (value >= (2.7 + 3) / 2) return 'B';
  if (value >= (2.3 + 2.7) / 2) return 'B-';
  if (value >= (2 + 2.3) / 2) return 'C+';
  if (value >= (1.7 + 2) / 2) return 'C';
  if (value >= (1.3 + 1.7) / 2) return 'C-';
  if (value >= (1 + 1.3) / 2) return 'D+';
  if (value >= (0.7 + 1) / 2) return 'D';
  return 'F';
}

// Visualize the average grade as well as the course load
export default function statsInfoDump({ courseLoad }) {
  gaugeData[0].value = courseLoad.courseAverageGrade * 25;
  gaugeData[1].value = courseLoad.majorAverageGrade * 25;
  generateLetterGrade(courseLoad.courseAverageGrade);
  return (
    <ReactECharts
      option={option}
      opts={{ renderer: 'svg' }}
      style={{ height: 200, marginTop: '-22px' }}
      onEvents={{}}
    />
  );
}
