import styled from 'styled-components';
import { SRLWrapper } from 'simple-react-lightbox';

const Gallery = ({ currentPin }) => {
  const photoUrls = currentPin.photos.map((photo) => ({
    thumbnail: photo.formats.thumbnail.url,
    original: photo.url,
  }));

  const options = {
    caption: {
      showCaption: false,
    },
  };

  return (
    <Container>
      <SRLWrapper options={options}>
        <Grid>
          {photoUrls.map((url, index) => (
            <a key={index} href={url.original}>
              <img src={url.thumbnail} alt={currentPin.location} />
            </a>
          ))}
        </Grid>
      </SRLWrapper>
    </Container>
  );
};

export default Gallery;

const Container = styled.div`
  margin: 7px 15px 0 29px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;

  a {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      object-fit: cover;
    }
  }
`;
