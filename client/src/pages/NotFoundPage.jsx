import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  const history = useHistory();

  return (
    <Container>
      <Helmet>
        <title>Pin My Map | Page Not Found</title>
        <meta
          name='description'
          content='Pin My Map - view personalised map with pinned places the user has been to.'
        />
      </Helmet>
      <Wrapper>
        <h1>Page not found.</h1>
        <Button
          variant='contained'
          color='warning'
          onClick={() => history.goBack()}
        >
          Go back
        </Button>
      </Wrapper>
      <Background src='/img/background.jpg' alt='pin_my_map_background' />
    </Container>
  );
};

export default NotFoundPage;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 360px;
  height: 300px;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
  padding: 30px 35px;
  background-color: #fff;

  h1 {
    margin-bottom: 35px;
    color: #212121;
  }
`;

const Background = styled.img`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: opacity(0.25);
  z-index: -1;
`;
