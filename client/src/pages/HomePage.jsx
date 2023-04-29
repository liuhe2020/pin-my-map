import { useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';

import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Loader from '../components/Loader';
import GlobalContext from '../context/GlobalContext';

const HomePage = () => {
  const { isLoading, authUser } = useContext(GlobalContext);
  const [isSignUp, setIsSignUp] = useState(false);

  const year = new Date().getFullYear();

  if (authUser) return <Redirect to='/map' />;

  return (
    <Container>
      <Main>
        <Logo src='/img/pin_logo_s.png' alt='pin_my_map_logo' />
        <TitleWrapper>
          <h1>Pin My Map</h1>
          <h2>Record and share all the places that you have been to.</h2>
          <Link
            to='/maps/1' // 1 is the ID of user named demo
          >
            <Button variant='contained' color='primary' type='button'>
              Demo
            </Button>
          </Link>
        </TitleWrapper>
        <FormWrapper>{isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <Login setIsSignUp={setIsSignUp} />}</FormWrapper>
        {isLoading && <Loader />}
      </Main>
      <Footer>
        <p>{`&copy; ${year} Pin My Map`}</p>
      </Footer>
      <Background src='/img/background.jpg' alt='pin_my_map_background' />
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 10vw;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 10vw;
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

const Logo = styled.img`
  position: absolute;
  left: 30px;
  top: 25px;
  width: 40px;
`;

const TitleWrapper = styled.div`
  margin: 0 5vw 3vw 5vw;
  width: 400px;

  @media (max-width: 768px) {
    width: 360px;
    margin: 100px 0 50px 0;
    text-align: center;
  }

  h1 {
    color: #ed6c02;
    font-weight: 700;
    font-size: 60px;

    @media (max-width: 500px) {
      font-size: 48px;
    }
  }

  h2 {
    color: #212121;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    margin-top: 20px;
  }

  button {
    margin-top: 20px;
  }

  a {
    text-decoration: none;
  }
`;

const FormWrapper = styled.div`
  margin: 0 5vw;

  @media (max-width: 768px) {
    margin: 0 0 0 0;
  }
`;

const Footer = styled.div`
  width: 100%;
  text-align: center;
  height: 60px;
  margin-top: 40px;
  color: #757575;
`;
