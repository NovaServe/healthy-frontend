import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './home/pages/HomePage';
import Navbar from './shared/components/Navbar';
import SignupPage from './users/pages/SignupPage';
import LoginPage from './auth/pages/LoginPage';
import LogoutPage from './auth/pages/LogoutPage';
import ListWorkouts from './workouts/pages/ListWorkouts';
import GetWorkoutDetail from './workouts/pages/GetWorkoutDetail';
import ListExercises from './workouts/pages/ListExercises';
import GetExerciseDetail from './workouts/pages/GetExerciseDetail';
import CreateExercise from './workouts/pages/CreateExercise';
import ListMedia from './media/pages/ListMedia';
import AddMedia from './media/pages/AddMedia';
import ManageMedia from './media/pages/ManageMedia';
import CreatePlan from './plans/pages/CreatePlan';
import ListPlans from './plans/pages/ListPlans';
import CalendarHome from './calendar/pages/CalendarHome';
import StatisticsHome from './statistics/pages/StatisticsHome';
import ListMeals from './nutrition/pages/ListMeals';
import ListMentalActivities from './mental/pages/ListMentalActivities';
import './App.css';
import './scss/custom.scss';

const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <div className='container-custom'>
          <Routes>
            <Route path='/' element={<HomePage />} />

            <Route path='/workouts' element={<ListWorkouts />} />
            <Route path='/workouts/:type/:id' element={<GetWorkoutDetail />} />
            <Route path='/workouts/exercises' element={<ListExercises />} />
            <Route path='/workouts/exercise/:type/:id' element={<GetExerciseDetail />} />
            <Route path='/workouts/exercises/add' element={<CreateExercise />} />

            <Route path='/media/:type' element={<ListMedia />} />
            <Route path='/media/:type/add' element={<AddMedia />} />
            <Route path='/media/:type/:id' element={<ManageMedia />} />

            <Route path='/plans/:type' element={<ListPlans />} />
            <Route path='/plans/:type/add/:id?' element={<CreatePlan />} />

            <Route path='/nutrition' element={<ListMeals />} />
            <Route path='/mental-health' element={<ListMentalActivities />} />

            <Route path='/calendar' element={<CalendarHome />} />
            <Route path='/statistics' element={<StatisticsHome />} />

            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/logout' element={<LogoutPage />} />
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
