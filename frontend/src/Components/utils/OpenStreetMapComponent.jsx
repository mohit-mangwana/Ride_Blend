import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import './MapTransition.css'; // Import the CSS for animations

// You may need to adjust the path to your marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// India's center coordinates
const INDIA_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

const MapEvents = ({ onLocationChange }) => {
  const map = useMap();
  useEffect(() => {
    map.on('click', (e) => {
      onLocationChange(e.latlng);
    });
  }, [map, onLocationChange]);
  return null;
};

const OpenStreetMapComponent = ({ location, onLocationChange, onAddressChange, searchInput }) => {
  const [markerPosition, setMarkerPosition] = useState(location);
  const mapRef = useRef(null);

  useEffect(() => {
    setMarkerPosition(location);
  }, [location]);

  useEffect(() => {
    if (searchInput) {
      handleSearch(searchInput);
    }
  }, [searchInput]);

  const handleLocationChange = (latlng) => {
    setMarkerPosition(latlng);
    onLocationChange(latlng);
    
    // Reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
      .then(response => response.json())
      .then(data => {
        if (data.display_name) {
          onAddressChange(data.display_name);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSearch = (searchInput) => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
          handleLocationChange(newLocation);
          mapRef.current.setView(newLocation, 13);
        } else {
          toast.error('Location not found. Please try again.');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="map-container">
      <MapContainer
        center={location}
        zoom={13}
        className="full-screen-map"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={markerPosition} icon={defaultIcon} />
        <MapEvents onLocationChange={handleLocationChange} />
      </MapContainer>
    </div>
  );
};

export default OpenStreetMapComponent;
