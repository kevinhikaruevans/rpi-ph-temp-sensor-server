import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { Link as RouterLink } from 'react-router-dom';

TimeAgo.addDefaultLocale(en); // doing this wrong lol

function SensorBadgeGridItem(props) {
    const { name, value } = props;
    const color = name === 'pH' ? 'warning' : 'success';
    let adornment = null;
    if (name === 'Temperature') {
        adornment = '°C';
    }
    return (
        <Grid item sx={{textAlign: "center"}} xs={12} sm={8} lg={4}>
            <Box sx={{borderWidth: 1, borderStyle: 'solid', borderColor: `${color}.main`, borderRadius: 1, padding: 1}}>
                <Typography variant="h6" sx={{backgroundColor: 'white'}}>{parseFloat(value).toFixed(2)} {adornment}</Typography>
                <Typography variant="overline">{name}</Typography>
            </Box>
        </Grid>
    );
}
function DevicesPage() {
    const timeAgo = new TimeAgo();
    const [devices, setDevices] = React.useState(null);

    useEffect(() => {
        const url = "/api/devices";
    
        const fetchData = async () => {
          try {
            const response = await fetch(url);
            const json = await response.json();

            setDevices(json.devices);
            setTimeout(fetchData, 30000);
          } catch (error) {
            console.log("error", error);
          }
        };
    
        fetchData();
    }, []);

    if (devices === null) {
        return (
            <>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
            </>
        )
    }
    function renderSensors(device) {
        const { sensors } = device;

        return (
            <Grid container spacing={2}>
                {sensors.map((sensor, index) => 
                    <SensorBadgeGridItem name={sensor.sensor_name} value={sensor.value} key={index} />
                )}
            </Grid>
        );
    }
    function renderDevices() {
        return devices.map(device => (
            <Card
                key={device.id}
            >
                <CardContent>
                    <Grid container>
                        <Grid item xs={8}>
                            <Typography variant="h5">{device.name}</Typography>
                            <Typography variant="subtitle" color="textSecondary" title={device.last_online}>Last updated {timeAgo.format(new Date(device.last_online))}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {renderSensors(device)}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button component={RouterLink} to={`/devices/${device.id}`} size="small" color="primary">View history</Button>
                </CardActions>
            </Card>
        ));
    }

    return (
        <>
            <Stack>
                {renderDevices()}
            </Stack>
        </>
    );
}

export default DevicesPage;