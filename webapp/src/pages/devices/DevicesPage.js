import React, { useEffect } from "react";
import { Skeleton } from "@mui/material";

function DevicesPage() {
    const [devices, setDevices] = React.useState(null);

    useEffect(() => {
        const url = "/api/devices";
    
        const fetchData = async () => {
          try {
            const response = await fetch(url);
            const json = await response.json();

            setDevices(json.devices);
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
    return devices.map(device => (
        <div key={device.id}>
            {device.name}
            {Date(device.last_online)}
        </div>
    ));
}

export default DevicesPage;