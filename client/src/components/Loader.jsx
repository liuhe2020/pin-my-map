import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import SyncLoader from 'react-spinners/SyncLoader';
import GlobalContext from '../context/GlobalContext';

const Loader = () => {
  const [showMsg, setShowMsg] = useState(false);
  const { isLoading } = useContext(GlobalContext);

  // show loading message after 5 seconds to alert user
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMsg(true);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <LoaderOverlay>
      {showMsg && <p>Please wait for loading. It may take up to 30 seconds.</p>}
      <SyncLoader color='#ed6c02' loading={isLoading} />
    </LoaderOverlay>
  );
};

export default Loader;

const LoaderOverlay = styled.div`
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(250, 250, 250, 0.7);
  text-align: center;

  p {
    color: #212121;
    margin: 0 20px 30px 20px;
  }
`;
