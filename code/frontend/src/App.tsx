import { Routes, Route } from "react-router-dom";

import {
  Home,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
  MedicalImage,
  DrugImage,
  SummarizeReport,
  History,
  ChatBot
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/medical-image" element={<MedicalImage />} />
          <Route path="/drug-image" element={<DrugImage />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/summarize-report" element={<SummarizeReport />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="history/:id" element={<History />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/chat-bot" element={<ChatBot/>} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
