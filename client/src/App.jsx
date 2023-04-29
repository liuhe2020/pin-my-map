import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/material';
import MuiTheme from './MuiTheme';
import SimpleReactLightbox from 'simple-react-lightbox';

import GlobalStyles from './globalStyles';
import { GlobalProvider } from './context/GlobalContext';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import UserMapPage from './pages/UserMapPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <GlobalProvider>
      <GlobalStyles />
      <ThemeProvider theme={MuiTheme}>
        <SimpleReactLightbox>
          <Router>
            <Switch>
              <Route exact path='/' component={HomePage}></Route>
              <Route exact path='/map' component={MapPage}></Route>
              <Route path='/maps/:id' component={UserMapPage}></Route>
              <Route path='/*' component={NotFoundPage}></Route>
            </Switch>
          </Router>
        </SimpleReactLightbox>
      </ThemeProvider>
      <StyledToastContainer
        position='bottom-left'
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        transition={Slide}
      />
    </GlobalProvider>
  );
}

export default App;

const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
})`
  width: 280px;
`;
