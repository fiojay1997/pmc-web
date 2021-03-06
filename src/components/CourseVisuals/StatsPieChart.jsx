import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Typography, Box } from '@mui/material';
import { pluralize } from '../../utils';

const colorPalette = ['#F18C8E', '#F0B7A4', '#F1D1B5', '#568EA6', '#305F72'];
let option = {
  title: {
    text: '',
    subtext: '',
    x: 'center',
  },

  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontWeight: 'bold',
    },
    formatter: '{d}% ({c}) students gave this class a {b}',
    borderRadius: 15,
    borderWidth: 8,
  },

  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['One Stars', 'Two Stars', 'Three Stars', 'Four Stars', 'Five Stars'],
  },
  series: [
    {
      label: {
        show: false,
      },
      name: 'Distribution',
      type: 'pie',
      radius: '90%',
      center: ['60%', '50%'],

      emphasis: {
        label: {
          show: false,
        },
      },
      data: [
        { value: 0, name: 'One Stars' },
        { value: 0, name: 'Two Stars' },
        { value: 0, name: 'Three Stars' },
        { value: 0, name: 'Four Stars' },
        { value: 0, name: 'Five Stars' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      color: colorPalette,
    },
  ],
};

function generateStarValues(reviews, option) {
  for (let i = 0; i < 5; i++) {
    option.series[0].data[i].value = 0;
  }
  for (let i = 0; i < reviews.length; i++) {
    option.series[0].data[reviews[i].rating - 1].value += 1;
  }
}

// Visualize the rating distribution with student's reviews
export default function ReviewPieChart({ reviews }) {
  generateStarValues(reviews, option);
  return (
    <Box>
      <Typography variant='subtitle2'>Rating Distribution</Typography>

      <Typography
        color='action'
        variant='body2'
        align='left'
        fontStyle='italic'
        sx={{ opacity: 0.75 }}
      >
        {reviews.length ? `Based on ${pluralize(reviews.length, 'review')}` : 'No reviews'}
      </Typography>

      <ReactECharts option={option} style={{ height: 170 }} />
    </Box>
  );
}
