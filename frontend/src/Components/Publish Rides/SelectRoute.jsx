import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useNavigate, useLocation } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SelectRoute = () => {
  const { rideDetails, setRideDetails } = useContext(RideContext);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isReturnRide = location.pathname.includes('return');

  useEffect(() => {
    const ride = isReturnRide ? rideDetails.returnRide : rideDetails.outboundRide;
    if (ride.pickupLocation && ride.dropLocation) {
      fetchRouteOptions(ride.pickupLocation, ride.dropLocation);
    }
  }, [isReturnRide, rideDetails.outboundRide, rideDetails.returnRide]);

  const fetchRouteOptions = async (pickupLocation, dropLocation) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${dropLocation.lng},${dropLocation.lat}?alternatives=true&overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data && data.routes) {
        setRoutes(data.routes);
        setSelectedRoute(data.routes[0]);
      } else {
        setError('No routes found');
      }
    } catch (error) {
      setError('Error fetching route options');
      console.error('Error fetching route options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleContinue = () => {
    if (selectedRoute) {
      setRideDetails((prevDetails) => ({
        ...prevDetails,
        [isReturnRide ? 'returnRide' : 'outboundRide']: {
          ...prevDetails[isReturnRide ? 'returnRide' : 'outboundRide'],
          distance: selectedRoute.distance,
          duration: selectedRoute.duration,
          route: selectedRoute.geometry,
        },
      }));
    }
    navigate(isReturnRide ? '/offerseat/return-date' : '/offerseat/date');
  };

  const formatDistance = (meters) => {
    return (meters / 1000).toFixed(2) + ' km';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Select Route</h2>
      <div style={styles.mapContainer}>
        <MapContainer
          center={
            isReturnRide
              ? rideDetails.returnRide.pickupLocation || [20.5937, 78.9629]
              : rideDetails.outboundRide.pickupLocation || [20.5937, 78.9629]
          }
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {isReturnRide ? (
            <>
              {rideDetails.returnRide.pickupLocation && (
                <Marker
                  position={[
                    rideDetails.returnRide.pickupLocation.lat,
                    rideDetails.returnRide.pickupLocation.lng,
                  ]}
                  icon={defaultIcon}
                />
              )}
              {rideDetails.returnRide.dropLocation && (
                <Marker
                  position={[
                    rideDetails.returnRide.dropLocation.lat,
                    rideDetails.returnRide.dropLocation.lng,
                  ]}
                  icon={defaultIcon}
                />
              )}
            </>
          ) : (
            <>
              {rideDetails.outboundRide.pickupLocation && (
                <Marker
                  position={[
                    rideDetails.outboundRide.pickupLocation.lat,
                    rideDetails.outboundRide.pickupLocation.lng,
                  ]}
                  icon={defaultIcon}
                />
              )}
              {rideDetails.outboundRide.dropLocation && (
                <Marker
                  position={[
                    rideDetails.outboundRide.dropLocation.lat,
                    rideDetails.outboundRide.dropLocation.lng,
                  ]}
                  icon={defaultIcon}
                />
              )}
            </>
          )}
          {selectedRoute && (
            <RoutingMachine
              pickupLocation={
                isReturnRide
                  ? rideDetails.returnRide.pickupLocation
                  : rideDetails.outboundRide.pickupLocation
              }
              dropLocation={
                isReturnRide
                  ? rideDetails.returnRide.dropLocation
                  : rideDetails.outboundRide.dropLocation
              }
              route={selectedRoute}
            />
          )}
        </MapContainer>
      </div>
      <div style={styles.routeOptions}>
        {loading ? (
          <p>Loading routes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : routes.length > 0 ? (
          routes.map((route, index) => (
            <div
              key={index}
              style={{
                ...styles.routeOption,
                ...(selectedRoute === route ? styles.selectedRoute : {}),
              }}
              onClick={() => handleRouteSelect(route)}
            >
              <p>Route {index + 1}</p>
              <p>Distance: {formatDistance(route.distance)}</p>
              <p>Duration: {formatDuration(route.duration)}</p>
            </div>
          ))
        ) : (
          <p>No route options available.</p>
        )}
      </div>
      <button
        style={styles.continueButton}
        onClick={handleContinue}
        disabled={!selectedRoute}
      >
        Continue
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  mapContainer: {
    marginBottom: '20px',
  },
  routeOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  routeOption: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  selectedRoute: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  continueButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

const RoutingMachine = ({ pickupLocation, dropLocation, route }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {

    if (!map || !pickupLocation || !dropLocation || !route) {
      console.log('Missing required props, not creating routing control');
      return;
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(pickupLocation.lat, pickupLocation.lng),
        L.latLng(dropLocation.lat, dropLocation.lng),
      ],
      lineOptions: {
        styles: [{ color: '#007bff', weight: 4 }],
      },
      createMarker: () => null,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false,
    });

    control.addTo(map);
    routingControlRef.current = control;

    return () => {
      console.log('RoutingMachine cleanup running');
      if (map && routingControlRef.current) {
        console.log('Removing routing control');
        try {
          routingControlRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingControlRef.current);
        } catch (error) {
          console.error('Error during routing control cleanup:', error);
        }
        routingControlRef.current = null;
      }
    };
  }, [map, pickupLocation, dropLocation, route]);

  console.log('RoutingMachine render');
  return null;
};



export default SelectRoute;
