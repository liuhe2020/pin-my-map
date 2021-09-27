import { useState, useEffect } from "react";
import styled from "styled-components";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ResetTvRounded, Room } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPin = ({ newCoord, setNewCoord, setPins }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [values, setValues] = useState({
    location: "",
    description: "",
    latitude: newCoord.lat,
    longitude: newCoord.long,
  });

  const handleDateChange = (newDate) => setSelectedDate(newDate);

  const handleImageChange = (e) => {
    // convert Filelist object to array and update in images state
    setImages([...e.target.files]);
  };

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map((image) => URL.createObjectURL(image));
      setImageUrls(urls);
    }
  }, [images]);

  const handleValueChange = (e) => {
    setIsEmpty(false);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate location field
    if (values.location === "") {
      setIsEmpty(true);
      return;
    }

    const submitValues = { ...values, date: selectedDate };
    const formData = new FormData();
    formData.append("data", JSON.stringify(submitValues));
    if (images) {
      images.forEach((image) =>
        formData.append(`files.photos`, image, image.name)
      );
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/pins`, {
      method: "POST",
      body: formData,
    });

    // const res = await fetch("http://localhost:1337/pins", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(submitValues),
    // });

    // if (!res.ok) {
    //   throw Error("Failed to upload data, please try again later.");
    // } else {
    //   const data = await res.json();

    //   if (images.length > 0) {
    //     const formData = new FormData();
    //     formData.append("ref", "pins");
    //     formData.append("refId", data.id);
    //     formData.append("field", "photos");
    //     images.forEach((image) => formData.append(`files`, image, image.name));

    //     const res = await fetch("http://localhost:1337/upload", {
    //       method: "POST",
    //       body: formData,
    //     });

    //     if (res.ok) {
    //       toast(`Added ${submitValues.location}!`);
    //       setNewCoord(null);
    //       setPins(null);
    //     }
    //   }
    // }
  };

  return (
    <Container>
      <Title>
        <Room color="warning" fontSize="large" />
        <h1>Add New Pin</h1>
      </Title>
      <Form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          error={isEmpty && true}
          helperText={isEmpty && "This field cannot be empty."}
          label="Location"
          name="location"
          value={values.location}
          onChange={handleValueChange}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            inputFormat="dd/MM/yyyy"
            label="Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          label="Description"
          name="description"
          value={values.description}
          onChange={handleValueChange}
        />
        <PhotoContainer>
          {imageUrls && (
            <PhotosGrid>
              {imageUrls.map((url, index) => (
                <Photo key={index} src={url} alt={values.location} />
              ))}
            </PhotosGrid>
          )}
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <Button
              variant="contained"
              component="span"
              size="small"
              color="warning"
            >
              {!imageUrls ? "Add Photos" : "Change Photos"}
            </Button>
          </label>
        </PhotoContainer>
        <Button variant="contained" color="primary" type="submit">
          Confirm
        </Button>
      </Form>
    </Container>
  );
};

export default AddPin;

const Container = styled.div`
  cursor: initial;
`;

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
  width: 400px;

  .MuiTextField-root {
    width: 95%;
    margin: 12px;
  }

  .MuiButton-root {
    margin: 12px;
  }
`;

const PhotoContainer = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  width: 95%;
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
`;

const PhotosGrid = styled.div`
  padding: 6px 12px 12px 12px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 4px;
`;

const Photo = styled.img`
  width: 100%;
  height: 47.69px;
  object-fit: cover;
`;

const Input = styled("input")({
  display: "none",
});
