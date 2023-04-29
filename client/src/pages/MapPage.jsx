import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useState, useContext, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import ReactMapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import Button from '@mui/material/Button';
import { ExitToApp } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';

import GlobalContext from '../context/GlobalContext';
import Drawer from '../components/Drawer';
import Pin from '../components/Pin';
import Loader from '../components/Loader';
import SocialShare from '../components/SocialShare';

const MapPage = () => {
  const {
    pins,
    authUser,
    setAuthUser,
    isLoading,
    newPin,
    setNewPin,
    setCurrentPin,
  } = useContext(GlobalContext);

  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [toggleAddPin, setToggleAddPin] = useState(false);
  const [toggleEditPin, setToggleEditPin] = useState(false);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4,
    minZoom: 1.585, // limit zoom out to single world map
    maxZoom: 19,
  });

  const mapRef = useRef();
  const drawerRef = useRef();

  const handleMapClick = () => {
    if (toggleDrawer) {
      drawerRef.current.handleDrawerClose();
    }
  };

  // create a new marker at clicked location
  const handleMapDblClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPin({ lat, long });
    setCurrentPin(null);
    setToggleEditPin(false);
    setToggleDrawer(true);
    setToggleAddPin(true);
  };

  // handling geocoder
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  const handleLogout = () => {
    localStorage.removeItem('pin-my-map-user');
    setAuthUser(null);
  };

  if (!authUser) return <Redirect to='/' />;

  return (
    <Container>
      <Helmet>
        <title>
          {authUser && `Pin My Map | ${authUser.user.username}'s map`}
        </title>
        <meta
          name='description'
          content="Pin My Map user's map page. Add, edit, update and delete pins on map."
        />
      </Helmet>
      <ReactMapGL
        {...viewport}
        mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
        doubleClickZoom={false}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={setViewport}
        onClick={handleMapClick}
        onDblClick={handleMapDblClick}
        ref={mapRef}
      >
        {pins &&
          pins.map((pin) => (
            <Pin
              key={pin.id}
              pin={pin}
              setViewport={setViewport}
              setToggleDrawer={setToggleDrawer}
              setToggleAddPin={setToggleAddPin}
              setToggleEditPin={setToggleEditPin}
            />
          ))}
        {isLoading && <Loader />}
        <Geocoder
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={handleGeocoderViewportChange}
          position='top-left'
          mapRef={mapRef}
        />
        {toggleAddPin && (
          <Marker
            latitude={newPin.lat}
            longitude={newPin.long}
            offsetLeft={-13} //centering marker
            offsetTop={-40} //centering marker
          >
            <img
              src='/img/marker_blue.svg'
              alt='marker_pin'
              style={{ cursor: 'pointer' }}
            />
          </Marker>
        )}
      </ReactMapGL>
      <AnimatePresence>
        {toggleDrawer && (
          <Drawer
            toggleAddPin={toggleAddPin}
            setToggleAddPin={setToggleAddPin}
            setToggleDrawer={setToggleDrawer}
            toggleEditPin={toggleEditPin}
            setToggleEditPin={setToggleEditPin}
            setViewport={setViewport}
            ref={drawerRef}
          />
        )}
      </AnimatePresence>
      <ButtonWrapper>
        <SocialShare id={authUser.user.id} />
        <Button
          variant='contained'
          size='small'
          color='warning'
          onClick={handleLogout}
        >
          <ExitToApp style={{ fontSize: '20px', marginRight: '3px' }} />
          Log out
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

export default MapPage;

const Container = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  .mapboxgl-ctrl {
    margin: 15px 0 0 15px;
  }

  .mapboxgl-ctrl-geocoder {
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
      0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  }

  .mapboxgl-ctrl-geocoder--input {
    :focus {
      outline: none;
    }
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  right: 10px;
  height: 40.4px;

  button {
    margin: 5px;
  }

  @media (max-width: 550px) {
    flex-direction: row-reverse;
    justify-content: flex-end;
    top: 70px;
    left: 10px;
  }
`;
