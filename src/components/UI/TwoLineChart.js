import { Fragment } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TwoLineChart = (props) => {
  return (
    <Fragment>
      <ResponsiveContainer width='75%' aspect={2}>
        <LineChart
          width={500}
          height={250}
          //data={data}
          margin={{
            top: 40,
            right: 40,
            left: 40,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            type='category'
            allowDuplicatedCategory={false}
            stroke='white'
            tick={{ fontSize: 15, dy: 25 }}
            angle={-45}
          />
          <YAxis
            type='number'
            domain={['auto', 'auto']}
            stroke='white'
            tick={{ fontSize: 15 }}
          />
          <Tooltip
            labelStyle={{ fontSize: '2rem' }}
            itemStyle={{ fontSize: '2rem' }}
          />
          <Legend
            layout='horizontal'
            verticalAlign='top'
            align='center'
            wrapperStyle={{
              fontSize: '2rem',
              padding: '2rem',
            }}
            iconSize={30}
          />
          <Line
            //type='monotone'
            dataKey='me'
            data={props.data[0].data}
            name={props.data[0].name}
            stroke='#f39c12'
            strokeWidth={5}
            activeDot={{ r: 10 }}
          />
          <Line
            dataKey='x'
            data={props.data[1].data}
            name={props.data[1].name}
            stroke='#0984e3'
            strokeWidth={5}
            activeDot={{ r: 10 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default TwoLineChart;
