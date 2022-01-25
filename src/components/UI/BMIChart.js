import { Fragment } from 'react';
import GaugeChart from 'react-gauge-chart';

const BMIChart = (props) => {
  const chartStyle = {
    height: 150,
    width: 300,
  };

  return (
    <Fragment>
      <GaugeChart
        id={props.id}
        style={chartStyle}
        colors={['#00FF00', '#FF0000']}
        nrOfLevels={15}
        textColor='#fff'
        needleColor='#20124d'
        needleBaseColor='#674ea7'
        percent={props.BMIPct}
        formatTextValue={(value) =>
          ((value / 100) * 11.4 + 18.5).toPrecision(3)
        }
      />
    </Fragment>
  );
};

export default BMIChart;
