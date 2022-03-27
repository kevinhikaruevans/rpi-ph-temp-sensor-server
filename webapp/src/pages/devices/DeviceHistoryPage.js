import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeSeriesScale
  } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import { Divider, Paper, Typography } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

// TimeAgo.addDefaultLocale(en); // doing this wrong lol

ChartJS.register(LinearScale, TimeSeriesScale, PointElement, LineElement, Tooltip, Legend);

const options = {
    responsive: true,
    // stacked: true,
    scales: {
        x: {
            type: 'time'
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'pH'
          },
          max: 9,
          min: 2,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
  };

const colors = [
    'rgb(0, 99, 132)',
    'rgb(22, 159, 64)',
    'rgb(255, 205, 86)',
];

function DeviceHistoryPage(props) {
    const { device_id } = useParams();
    const [ device, setDevice ] = React.useState(null);
    const [ datasets, setDatasets ] = React.useState(null);
    const timeAgo = new TimeAgo();

    useEffect(() => {
      const url = "/api/devices";
  
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();

          // eslint-disable-next-line eqeqeq
          setDevice(json.devices.find(device => device.id == device_id));
        } catch (error) {
          console.log("error", error);
        }
      };
  
      fetchData();
    }, [device_id]);

    useEffect(() => {
        const start_time = new Date(new Date() - (1000 * 60 * 60 * 24)); // 1440 points or so
        const url = `/api/entries/${device_id}/${start_time.toISOString()}`;
    
        const fetchData = async () => {
          try {
            const response = await fetch(url);
            const { entries } = await response.json();

            // entries = [ {device_id, sensor: {description, name}, sensor_id, timestamp, value}]
            const ds = entries.reduce((acc, entry) => {
                const { sensor_id, sensor } = entry;

                if (!acc[sensor_id]) {
                    acc[sensor_id] = {
                        label: sensor.name,
                        data: [],
                        // borderColor: 'black',
                        backgroundColor: colors[sensor_id % colors.length],
                        yAxisID: sensor_id === 1 ? 'y' : 'y1',
                    };
                }
                
                acc[sensor_id].data.push({
                    x: new Date(entry.timestamp),
                    y: entry.value
                });
                
                return acc;
            }, { });

            setDatasets(Object.values(ds));
            setTimeout(fetchData, 60000);
          } catch (error) {
            console.log("error", error);
          }
        };
    
        fetchData();
    }, [device_id]);
    
    if (datasets === null || device === null) {
        return 'Loading...';
    }
    function renderDeviceName(device) {
      const { name } = device;
      const split = name.split('-');
      return (
          <>
              <Typography variant="h5">{split[0].trim()}</Typography>
              <Typography variant="overline" sx={{display: 'block'}}>{split[1].trim()}</Typography>
              <Typography variant="subtitle" color="textSecondary" title={device.last_online}>Last updated {timeAgo.format(new Date(device.last_online))}</Typography>
          </>
      );
    }
    
    return <Paper sx={{padding: 2}}>
        {/* <Button component={RouterLink} to={`/devices/${device_id}`}>Back</Button> */}
        {renderDeviceName(device)}
        <Divider sx={{my: 2}} />
        <Typography variant="h5">Device history</Typography>
        <Typography variant="subtitle"></Typography>
        <Scatter options={options} data={{ datasets }} />
    </Paper>
}

export default DeviceHistoryPage