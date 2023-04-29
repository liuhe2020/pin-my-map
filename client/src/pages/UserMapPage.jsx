import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import ReactMapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';

import Drawer from '../components/Drawer';
import Pin from '../components/Pin';
import Loader from '../components/Loader';
import GlobalContext from '../context/GlobalContext';

const UserMapPage = () => {
  const history = useHistory();
  const { id } = useParams();

  const { isLoading, setIsLoading } = useContext(GlobalContext);

  const [user, setUser] = useState(null);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [toggleAddPin, setToggleAddPin] = useState(false); // declared & passed down for re-using Drawer & Pin component
  const [toggleEditPin, setToggleEditPin] = useState(false); // declared & passed down for re-using Drawer & Pin component
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

  const handleSignUp = () => {
    history.push('/');
  };

  useEffect(() => {
    const getPins = async () => {
      setIsLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`);
      if (res.status !== 200) {
        setIsLoading(false);
        history.push('/');
        toast.error('Network error. Please try again later.');
      } else {
        const user = await res.json();
        setUser(user);
        setIsLoading(false);
      }
    };
    getPins();
  }, [id, setIsLoading, history]);

  return (
    <Container>
      <Helmet>
        <title>{user && `Pin My Map | ${user.username}`}</title>
        <meta
          name='description'
          content='Pin My Map - view personalised map with pinned places the user has been to.'
        />
      </Helmet>
      <ReactMapGL
        {...viewport}
        mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
        doubleClickZoom={false}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={setViewport}
        onClick={handleMapClick}
        ref={mapRef}
      >
        {user &&
          user.pins.map((pin) => (
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
      </ReactMapGL>
      <Geocoder
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={handleGeocoderViewportChange}
        position='top-left'
        mapRef={mapRef}
      />
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
      <StyledButton
        variant='contained'
        size='small'
        color='warning'
        onClick={handleSignUp}
      >
        Sign Up
      </StyledButton>
    </Container>
  );
};

export default UserMapPage;

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

const StyledButton = muiStyled(Button)`
  position: absolute;
  top: 15px;
  right: 15px;

  @media (max-width: 550px) {
  top: 75px;
  left: 15px;
  }
`;
