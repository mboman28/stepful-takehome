import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import Coaches from './components/coaches/Coaches';
import CoachView from './components/coaches/CoachView';
import Home from './components/shared/Home';
import Students from './components/students/Students';
import StudentView from './components/students/StudentView';
import Error from './components/shared/Error'
import BookSession from './components/students/BookSession';
import AddAvailability from './components/coaches/AddAvailiablity';
import PastSessions from './components/coaches/PastSessions';
import Upcoming from './components/students/Upcoming';
import Content from "./components/shared/Content";
import { Title } from "./components/shared/sharedStyles";

const App: React.FC = () => {
  const navigate = useNavigate();
  const pathName = useLocation().pathname
  let userType = ''

  if (pathName.includes('students')) {
    userType = 'Student';
  }
  else if (pathName.includes('coaches')) {
    userType = 'Coach';
  }
  else {
    userType = '';
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' >
        <Toolbar>
          <Title variant="h5" onClick={() => navigate('/')}>
            Scheduling App
          </Title>
          {userType.length > 0 ? <Typography>Acting as: {userType}</Typography> : <></>}
        </Toolbar>
      </AppBar>
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentView />} />
          <Route path="/students/:id/upcoming" element={<Upcoming />} />
          <Route path="/students/:id/book" element={<BookSession />} />
          <Route path="/coaches/:id" element={<CoachView />} />
          <Route path="/coaches/:id/availability" element={<AddAvailability />} />
          <Route path="/coaches/:id/pastsessions" element={<PastSessions />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Content>
    </Box>
  )
}

export default App
