import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Room, DeleteForever } from '@mui/icons-material';
import { toast } from 'react-toastify';

import GlobalContext from '../context/GlobalContext';

const EditPin = ({ setToggleEditPin }) => {
  const { setIsLoading, authUser, currentPin, setCurrentPin, pins, setPins } =
    useContext(GlobalContext);

  const [selectedDate, setSelectedDate] = useState(currentPin.date);
  const [images, setImages] = useState(currentPin.photos);
  const [addedImageUrls, setAddedImageUrls] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [values, setValues] = useState({
    location: currentPin.location,
    description: currentPin.description,
    latitude: currentPin.latitude,
    longitude: currentPin.longitude,
  });

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
      setAddedImages([...imageFiles]);
    }
  };

  const handleImageDelete = (e) => {
    const imageId = Number(e.target.closest('div').previousSibling.id);
    const newImages = images.filter((image) => image.id !== imageId);
    const newDeletedImage = images.filter((image) => image.id === imageId)[0];
    setImages(newImages);
    setDeletedImages([...deletedImages, newDeletedImage]);
  };

  useEffect(() => {
    if (addedImages.length > 0) {
      const urls = addedImages.map((image) => URL.createObjectURL(image));
      setAddedImageUrls(urls);
    }
  }, [addedImages]);

  const handleValueChange = (e) => {
    setIsEmpty(false);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const amendValues = () => {
    const submitValues = { ...values, date: selectedDate };
    const res = fetch(
      `${process.env.REACT_APP_API_URL}/pins/${currentPin.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.jwt}`,
        },
        body: JSON.stringify(submitValues),
      }
    );
    return res;
  };

  const deleteImages = () => {
    if (deletedImages.length > 0) {
      const res = deletedImages.map((image) => {
        const singleRes = fetch(
          `${process.env.REACT_APP_API_URL}/upload/files/${image.id}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authUser.jwt}` },
          }
        );
        return singleRes;
      });
      return res;
    } else {
      return [];
    }
  };

  const addImages = () => {
    if (addedImages.length > 0) {
      const formData = new FormData();
      formData.append('ref', 'pins');
      formData.append('refId', currentPin.id);
      formData.append('field', 'photos');
      addedImages.forEach((image) =>
        formData.append(`files`, image, image.name)
      );
      const res = fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authUser.jwt}` },
        body: formData,
      });
      return [res];
    } else {
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate location field
    if (values.location === '') {
      setIsEmpty(true);
      return;
    }

    setIsLoading(true);

    const allResponses = await Promise.all([
      amendValues(),
      ...deleteImages(),
      ...addImages(),
    ]);

    // check if any response has error
    const hasFailedResponse = allResponses.some((res) => res.status !== 200);

    if (hasFailedResponse) {
      toast.error(
        'Network error. Failed to update the pin, please try again later.'
      );
    } else {
      // get the pin after editting to update currentPin & pins(for map markers)
      const editedRes = await fetch(
        `${process.env.REACT_APP_API_URL}/pins/${currentPin.id}`
      );
      if (editedRes.status !== 200) {
        toast.error(
          'Network error. Failed to retrieve the dated pin, please refresh the page.'
        );
      } else {
        const data = await editedRes.json();
        const EditedPins = pins.map((pin) =>
          pin.id === data.id ? { ...data } : pin
        );
        setCurrentPin(data);
        setPins(EditedPins);
        setToggleEditPin(false);
        toast.success(`${values.location} - Updated`);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <Title>
        <Room color='warning' fontSize='large' />
        <h1>Edit Pin</h1>
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
        <PhotosContainer>
          {images && (
            <PhotosGrid>
              {images.map((photo) => (
                <PhotoWrapper key={photo.id}>
                  <Photo id={photo.id} src={photo.formats.thumbnail.url} />
                  <div>
                    <DeleteForever
                      color='warning'
                      onClick={handleImageDelete}
                    />
                  </div>
                </PhotoWrapper>
              ))}
              {addedImageUrls &&
                addedImageUrls.map((url, index) => (
                  <PhotoWrapper key={index}>
                    <Photo src={url} />
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
              {!addedImageUrls ? 'Add Photos' : 'Change Photos'}
            </StyledAddButton>
          </label>
        </PhotosContainer>
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
            onClick={() => setToggleEditPin(false)}
          >
            Cancel
          </StyledButton>
        </ButtonWrapper>
      </Form>
    </>
  );
};

export default EditPin;

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

const PhotosContainer = styled.div`
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

  div {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: none;

    svg {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  :hover {
    div {
      display: block;
    }
  }
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
