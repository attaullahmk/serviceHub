import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxMap.css';

const MapboxMap = ({ services }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();
  const [activePopups, setActivePopups] = useState({});

  useEffect(() => {
    if (!services || services.length === 0) return;

    const maptoken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapboxgl.accessToken = maptoken;

    const fetchGeolocation = async () => {
      try {
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

        const [lng, lat] = validLocations[0].location;

        if (!mapRef.current) {
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 10,
          });

          // Add custom zoom controls
          const zoomIn = document.createElement('button');
          zoomIn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-in';
          zoomIn.innerHTML = '+';
          zoomIn.addEventListener('click', () => mapRef.current.zoomIn());

          const zoomOut = document.createElement('button');
          zoomOut.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-out';
          zoomOut.innerHTML = '-';
          zoomOut.addEventListener('click', () => mapRef.current.zoomOut());

          const zoomControl = document.createElement('div');
          zoomControl.className = 'mapboxgl-ctrl mapboxgl-ctrl-group custom-zoom-control';
          zoomControl.appendChild(zoomIn);
          zoomControl.appendChild(zoomOut);

          mapContainerRef.current.appendChild(zoomControl);
        } else {
          mapRef.current.flyTo({ center: [lng, lat], zoom: 10 });
        }

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        validLocations.forEach(({ service, location }) => {
          const popupContent = document.createElement("div");
          popupContent.className = "popup-content-wrapper";
          
          popupContent.innerHTML = `
            <div class="map-popup-card">
              <div class="image-carousel">
                ${service.imageGallery?.length ? `
                  <div class="carousel-container">
                    ${service.imageGallery.map((img, index) => `
                      <img 
                        src="${img}" 
                        alt="Service ${index + 1}" 
                        class="${index === 0 ? 'active' : ''}"
                        data-index="${index}"
                      />
                    `).join('')}
                  </div>
                  ${service.imageGallery.length > 1 ? `
                    <div class="carousel-controls">
                      <div class="carousel-dots">
                        ${service.imageGallery.map((_, index) => `
                          <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                ` : `
                  <div class="no-image">No Images Available</div>
                `}
              </div>
              <div class="info">
                <div class="title">${service.title.slice(0, 22)}</div>
                <div class="rating-container">
                  <div class="stars">
                    ${renderStarRating(service.averageRating)}
                  </div>
                  <div class="rating-text">
                    ${service.averageRating?.toFixed(1) || '0.0'} Reviews ( ${service.totalReviews || 0})
                  </div>
                </div>
                <div class="location">${service.address.slice(0, 28)}</div>
                <div class="price">PKR ${service.price?.toLocaleString()}/hour</div>
              </div>
            </div>
          `;

          const popupCard = popupContent.querySelector(".info");
          popupCard.addEventListener("click", () => {
            navigate(`/services/${service._id}`);
          });

          // Initialize carousel functionality
          if (service.imageGallery?.length > 1) {
            const dots = popupContent.querySelectorAll('.dot');
            const images = popupContent.querySelectorAll('.carousel-container img');
            
            dots.forEach(dot => {
              dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                
                // Update active image
                images.forEach(img => img.classList.remove('active'));
                images[index].classList.add('active');
                
                // Update active dot
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
              });
            });
          }

          const popup = new mapboxgl.Popup({ 
            offset: 8,
            className: 'custom-popup'
          }).setDOMContent(popupContent);

          const marker = new mapboxgl.Marker({ 
            color: '#FF5733',
            draggable: false
          })
            .setLngLat(location)
            .setPopup(popup)
            .addTo(mapRef.current);

          markersRef.current.push(marker);
        });

      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      }
    };

    const renderStarRating = (rating) => {
      rating = rating || 0;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      
      let stars = '';
      
      // Full stars
      for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star full">★</span>';
      }
      
      // Half star
      if (hasHalfStar) {
        stars += '<span class="star half">★</span>';
      }
      
      // Empty stars
      for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">★</span>';
      }
      
      return stars;
    };

    fetchGeolocation();

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      if (mapRef.current) mapRef.current.remove();
    };
  }, [services, navigate]);

  return (
    <div className="container my-4 map">
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapboxMap;
