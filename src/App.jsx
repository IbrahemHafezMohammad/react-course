import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import MainLayout from "./layouts/MainLayout";
import { PrivateRoute, PrivateSeekerRoute, PrivateEmployerRoute } from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import PostJobPage from "./pages/PostJobPage";
// import LoginPage from "./pages/LoginPage";
import JobPage, { jobLoader } from "./pages/JobPage";

const App = () => {

  const { userInfo, userType } = useSelector((state) => state.auth);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="" element={<PrivateEmployerRoute />}>
          <Route path="/post-job" element={<PostJobPage />} />
        </Route>
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/jobs" element={<JobsPage />} /> */}
        {/* <Route path="/add-job" element={<AddJobPage addJobSubmit={addJob} />} /> */}
        {/* <Route path="/jobs/:id" element={<JobPage deleteJob={deleteJob} />} loader={jobLoader} /> */}
        {/* <Route path="/edit-job/:id" element={<EditJobPage updateJobSubmit={updateJob} />} loader={jobLoader} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};
export default App;
