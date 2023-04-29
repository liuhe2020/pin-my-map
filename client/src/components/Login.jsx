import { useState, useContext } from 'react';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';

import GlobalContext from '../context/GlobalContext';

const Login = ({ setIsSignUp }) => {
  const { setAuthUser, setIsLoading } = useContext(GlobalContext);
  const [hasEmail, setHasEmail] = useState(true);
  const [hasPassword, setHasPassword] = useState(true);
  const [loginCreds, setLoginCreds] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e) => {
    setHasEmail(true);
    setHasPassword(true);
    const { name, value } = e.target;
    setLoginCreds({ ...loginCreds, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate form - no empty fields
    if (loginCreds.identifier === '') {
      setHasEmail(false);
      return;
    }

    if (loginCreds.password === '') {
      setHasPassword(false);
      return;
    }

    setIsLoading(true);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginCreds),
    });

    if (res.status !== 200) {
      toast.error('Failed to log in, please try again.');
    } else {
      const data = await res.json();
      localStorage.setItem('pin-my-map-user', JSON.stringify(data));
      setAuthUser(data);
      toast.info('Tip: double click on the map to add a new pin.', {
        position: 'bottom-right',
        autoClose: false,
      });
    }

    setIsLoading(false);
  };

  return (
    <Container>
      <h1>Account Login</h1>
      <Form>
        <StyledTextField
          id='outlined-password-input'
          label='Username or email address'
          name='identifier'
          value={loginCreds.identifier}
          variant='outlined'
          color='warning'
          onChange={handleChange}
          error={!hasEmail && true}
          helperText={!hasEmail && 'Email address is required.'}
        />
        <StyledTextField
          id='outlined-basic'
          type='password'
          autoComplete='current-password'
          label='Password'
          name='password'
          value={loginCreds.password}
          variant='outlined'
          color='warning'
          onChange={handleChange}
          error={!hasPassword && true}
          helperText={!hasPassword && 'Password is required.'}
        />
        <StyledButton
          variant='contained'
          color='warning'
          style={{ width: '100%' }}
          onClick={handleSubmit}
        >
          Log in
        </StyledButton>
        <BreakLine />
        <StyledButton
          variant='contained'
          color='primary'
          onClick={() => setIsSignUp(true)}
        >
          Sign up
        </StyledButton>
      </Form>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  width: 360px;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
  padding: 30px 35px;
  background-color: #fff;

  h1 {
    color: #ed6c02;
    font-size: 26px;
    margin-bottom: 15px;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTextField = muiStyled(TextField)`
  width: 100%;
  margin: 10px 0;
`;

const StyledButton = muiStyled(Button)`
  margin-top: 10px;
`;

const BreakLine = styled.span`
  width: 100%;
  height: 0.5px;
  background-color: #bdbdbd;
  margin: 20px 0 8px;
`;
