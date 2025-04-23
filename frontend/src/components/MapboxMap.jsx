import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxMap.css';

const MapboxMap = ({ services }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // Store markers to update them later
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    if (!services || services.length === 0) return; // Ensure service data exists
    console.log("map", services);

    const maptoken = 'pk.eyJ1IjoiYXR0YXVsbGFoMTMxNDAyNSIsImEiOiJjbTZidWdvbGswYmJxMmtzZGw2OGN3MDQ0In0.tGQ5FDy_IctoxWbEMIC6Vw';
    mapboxgl.accessToken = maptoken;

    const fetchGeolocation = async () => {
      try {
        // Fetch geolocation for services
        const geolocationPromises = services.map(service =>
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(service.address)}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => ({
              service,
              location: data.features.length ? data.features[0].center : null
            }))
        );

        const locations = await Promise.all(geolocationPromises);
        const validLocations = locations.filter(loc => loc.location !== null);

        if (validLocations.length === 0) {
          console.error("No valid geolocation data found.");
          return;
        }

        // Set the center based on the first valid service
        const [lng, lat] = validLocations[0].location;

        // Initialize the map only once
        if (!mapRef.current) {
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 10,
          });
        } else {
          // If the map already exists, just fly to the new center
          mapRef.current.flyTo({ center: [lng, lat], zoom: 10 });
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        validLocations.forEach(({ service, location }) => {
          const popupContent = document.createElement("div");
          popupContent.innerHTML = `
            <h3 style="color: #007bff; cursor: pointer;">${service.title}</h3>
            <img src="${service.imageGallery?.[0] || ''}" alt="Service Image" style="width:100px;height:auto;border-radius:5px;"/>
            <ul>
              <li><b>Category:</b> ${service.category}</li>
              <li><b>Price:</b> PKR ${service.price}</li>
              <li><b>Provider:</b> ${service.provider?.name}</li>
              <li><b>Availability:</b> ${service.availability}</li>
              <li><b>Location:</b> ${service.address}</li>
            </ul>
          `;

          popupContent.querySelector("h3").addEventListener("click", () => {
            navigate(`/services/${service._id}`);
          });

          const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);

          const marker = new mapboxgl.Marker({ color: '#FF5733' })
            .setLngLat(location)
            .setPopup(popup)
            .addTo(mapRef.current);

          markersRef.current.push(marker);
        });

      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      }
    };

    fetchGeolocation();

  }, [services, navigate]); // Update markers only when services change

  return (
    <div className="container my-4 map">
      <h3 className="text-center mb-3">Service Locations</h3>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapboxMap;
