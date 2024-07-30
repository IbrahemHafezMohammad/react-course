import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import React from "react";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
// import LoginPage from "./pages/LoginPage";
import JobPage, { jobLoader } from "./pages/JobPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
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
