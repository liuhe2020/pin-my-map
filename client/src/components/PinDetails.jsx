import { useState, useContext } from 'react';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Room, Today, TextSnippet, Photo } from '@mui/icons-material';
import { toast } from 'react-toastify';

import Gallery from './Gallery';
import GlobalContext from '../context/GlobalContext';

const PinDetails = ({ handleDrawerClose, setToggleEditPin }) => {
  const { authUser, setIsLoading, currentPin, setPins } =
    useContext(GlobalContext);

  const [toggleDelete, setToggleDelete] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/pins/${currentPin.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authUser.jwt}` },
      }
    );

    if (res.status !== 200) {
      toast.error('Network error. Please try again later.');
    } else {
      const data = await res.json();
      setPins((prev) => prev.filter((pin) => pin.id !== data.id));
      setToggleDelete(false);
      handleDrawerClose();
      toast.success(`${currentPin.location} - Deleted`);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Details>
        <Line>
          <Room color='warning' />
          <label>Location</label>
        </Line>
        <h3>{currentPin.location}</h3>
        {currentPin.date && (
          <>
            <Line>
              <Today color='warning' />
              <label>Date</label>
            </Line>
            <h4>{currentPin.date}</h4>
          </>
        )}
        {currentPin.description && (
          <>
            <Line>
              <TextSnippet color='warning' />
              <label>Description</label>
            </Line>
            <p>{currentPin.description}</p>
          </>
        )}
        {currentPin.photos.length > 0 && (
          <>
            <Line>
              <Photo color='warning' />
              <label>Gallery</label>
            </Line>
            <Gallery currentPin={currentPin} />
          </>
        )}
      </Details>
      {authUser && (
        <ButtonWrapper>
          <StyledButton
            variant='contained'
            size='small'
            color='primary'
            onClick={() => setToggleEditPin(true)}
          >
            Edit
          </StyledButton>
          <StyledButton
            variant='contained'
            size='small'
            color='error'
            onClick={() => setToggleDelete(true)}
          >
            Delete
          </StyledButton>
        </ButtonWrapper>
      )}
      {toggleDelete && (
        <Delete>
          <p>Are you sure you want to delete {currentPin.location}?</p>
          <div>
            <StyledButton
              variant='contained'
              size='small'
              color='error'
              onClick={handleDelete}
            >
              Delete
            </StyledButton>
            <StyledButton
              variant='contained'
              size='small'
              color='primary'
              onClick={() => setToggleDelete(false)}
            >
              Cancel
            </StyledButton>
          </div>
        </Delete>
      )}
    </>
  );
};

export default PinDetails;

const Details = styled.div`
  label {
    margin-left: 5px;
    font-size: 14px;
    font-weight: 500;
  }

  h3,
  h4,
  p {
    margin: 3px 19px 10px 29px;
    color: #212121;
  }

  h3 {
    font-size: 18px;
    font-weight: 500;
  }

  h4 {
    font-size: 15px;
    font-weight: 400;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  color: #ed6c02;
  padding-top: 15px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const Delete = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    margin: 30px;
  }
`;

const StyledButton = muiStyled(Button)`
  margin: 5px;
`;
