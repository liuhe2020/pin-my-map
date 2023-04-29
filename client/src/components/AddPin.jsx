import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Room } from '@mui/icons-material';
import { toast } from 'react-toastify';

import GlobalContext from '../context/GlobalContext';

const AddPin = ({ handleDrawerClose, setToggleAddPin }) => {
  const { setIsLoading, authUser, setPins, newPin, setCurrentPin } =
    useContext(GlobalContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [values, setValues] = useState({
    location: '',
    description: '',
    latitude: newPin.lat,
    longitude: newPin.long,
    user: authUser.user.id,
  });

  const handleValueChange = (e) => {
    setIsEmpty(false);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleDateChange = (newDate) => setSelectedDate(newDate);

  const handleImageChange = (e) => {
    // convert Filelist object to array and update in images state
    const imageFiles = [...e.target.files];
    // check images size - limit 1MB
    const oversizedImages = imageFiles.filter(
      (file) => file.size > 1024 * 1000
    );

    if (oversizedImages.length > 0) {
      toast.warn('The maximum size for each image is 1MB.');
    } else {
      setImages([...imageFiles]);
    }
  };

  // use createObjectURL to generate urls locally for the Filelist
  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map((image) => URL.createObjectURL(image));
      setImageUrls(urls);
    }
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate location field
    if (values.location === '') {
      setIsEmpty(true);
      return;
    }

    setIsLoading(true);

    // use formdata as Strapi documentation to post files together while creating an entry
    const submitValues = { ...values, date: selectedDate };
    const formData = new FormData();
    formData.append('data', JSON.stringify(submitValues));
    if (images) {
      images.forEach((image) =>
        formData.append(`files.photos`, image, image.name)
      );
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/pins`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authUser.jwt}` },
      body: formData,
    });

    if (res.status !== 200) {
      toast.error('Network error. Please try again later.');
    } else {
      // update pins(for markers) and currentPins state
      const data = await res.json();
      setPins((prev) => [...prev, data]);
      setCurrentPin(data);
      setToggleAddPin(false);
      toast.success(`${submitValues.location} - Added`);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Title>
        <Room color='warning' fontSize='large' />
        <h1>Add New Pin</h1>
      </Title>
      <Form onSubmit={handleSubmit}>
        <StyledTextField
          id='outlined-basic'
          variant='outlined'
          error={isEmpty && true}
          helperText={isEmpty && 'This field cannot be empty.'}
          label='Location'
          name='location'
          value={values.location}
          onChange={handleValueChange}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            inputFormat='dd/MM/yyyy'
            label='Date'
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <StyledTextField {...params} />}
          />
        </LocalizationProvider>
        <StyledTextField
          id='outlined-multiline-static'
          multiline
          rows={8}
          label='Description'
          name='description'
          value={values.description}
          onChange={handleValueChange}
        />
        <PhotoContainer>
          {imageUrls && (
            <PhotosGrid>
              {imageUrls.map((url, index) => (
                <PhotoWrapper key={index}>
                  <Photo src={url} alt={values.location} />
                </PhotoWrapper>
              ))}
            </PhotosGrid>
          )}
          <p>The maximum image size is 1MB.</p>
          <label htmlFor='contained-button-file'>
            <Input
              accept='image/*'
              id='contained-button-file'
              multiple
              type='file'
              onChange={handleImageChange}
            />
            <StyledAddButton
              variant='contained'
              component='span'
              size='small'
              color='warning'
            >
              {!imageUrls ? 'Add Photos' : 'Change Photos'}
            </StyledAddButton>
          </label>
        </PhotoContainer>
        <ButtonWrapper>
          <StyledButton
            variant='contained'
            size='small'
            color='primary'
            type='submit'
          >
            Confirm
          </StyledButton>
          <StyledButton
            variant='contained'
            size='small'
            color='error'
            onClick={handleDrawerClose}
          >
            Cancel
          </StyledButton>
        </ButtonWrapper>
      </Form>
    </>
  );
};

export default AddPin;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: #ed6c02;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledTextField = muiStyled(TextField)`
  width: 100%;
  margin: 12px;
`;

const StyledAddButton = muiStyled(Button)`
  margin: 12px;
`;

const PhotoContainer = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  width: 100%;
  margin: 12px 0;
  padding: 12px 0;
  display: flex;
  flex-direction: column;

  :hover {
    border-color: #212121;
  }

  label {
    margin: auto;
  }

  p {
    text-align: center;
    color: #bdbdbd;
    font-size: 14px;
  }
`;

const PhotosGrid = styled.div`
  padding: 6px 12px 12px 12px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 4px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PhotoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
`;

const Photo = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  object-fit: cover;
`;

const Input = styled('input')({
  display: 'none',
});

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const StyledButton = muiStyled(Button)`
  margin: 5px;
`;
