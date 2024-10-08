import React, { useEffect, useState } from "react";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import axios from "axios";
import { constants } from "../context/API/constants";
import { ClipLoader } from "react-spinners";
import { FilePdfOutlined } from "@ant-design/icons";
import { Tooltip, Button } from "antd";

function UpdateProfileModal({ visible, onClose }) {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [resumeLink, setResumeLink] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const { userInfo, userType, token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (userInfo) {
      setValue("email", userInfo.email);
      setValue("phone", userInfo.phone);
      setValue("name", userInfo.name);
      setValue("gender", userInfo.gender?.toString() || "");
      if (userType === "seeker") {
        setValue("headline", userInfo.headline || "");
        setValue("desc", userInfo.desc || "");
        setValue("birthday", userInfo.birthday || "");
        if (userInfo.resume) {
          setResumeLink(userInfo.resume);
        }
      }
    }
  }, [userInfo, userType, setValue]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 500 * 1024 * 1024
    ) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", "resumes");

      setUploading(true);
      try {
        const response = await axios.post(
          `${constants.BASE_URL}/upload/file`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setResumeLink(response.data.link);
        setUploading(false);
      } catch (error) {
        setUploading(false);
        setErrMsg("Failed to upload resume. Please try again.");
      }
    } else {
      setErrMsg(
        "Invalid file type or size. Please upload a PDF file up to 500MB."
      );
    }
  };

  const handleDeleteResume = () => {
    setResumeLink(null);
  };

  const onSubmit = async (data) => {
    data.resume = resumeLink ? resumeLink : null;

    setLoading(true);

    const apiUrl =
      userType === "seeker"
        ? `${constants.BASE_URL}/seeker/update/${userInfo.user_id}`
        : `${constants.BASE_URL}/employer/update/${userInfo.user_id}`;

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        setCredentials({
          userInfo: response.data,
          userType,
          emailVerified: response.data?.email_verified_at ? "yes" : "no",
          token,
        })
      );

      setLoading(false);
      setErrMsg("");
      onClose(); // Close the modal after a successful update
    } catch (error) {
      setLoading(false);
      if (error?.response?.status === 422) {
        const validationErrors = error.response.data.message;
        Object.keys(validationErrors).forEach((field) => {
          setError(field, {
            type: "manual",
            message: validationErrors[field][0],
          });
        });
      } else {
        setErrMsg("An error occurred. Please try again.");
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <form
          className="w-full flex flex-col gap-4 mt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            name="name"
            label="Full Name"
            placeholder="Full Name"
            type="text"
            register={register("name", {
              required: "Full name is required!",
            })}
            error={errors.name ? errors.name.message : ""}
          />

          <TextInput
            name="email"
            label="Email Address"
            placeholder="email@example.com"
            type="email"
            register={register("email", {
              required: "Email Address is required!",
            })}
            error={errors.email ? errors.email.message : ""}
          />

          <TextInput
            name="phone"
            label="Phone Number"
            placeholder="+12345678901"
            type="tel"
            register={register("phone", {
              required: "Phone number is required!",
              pattern: {
                value: /^[\+][0-9]{11,14}$/,
                message:
                  "Phone number must be in the format +12345678901 and 11-14 digits long",
              },
            })}
            error={errors.phone ? errors.phone.message : ""}
          />

          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("gender")}
            >
              <option value="">Prefer not to say</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>
          </div>

          {userType === "seeker" && (
            <>
              <TextInput
                name="headline"
                label="Headline"
                placeholder="Headline"
                type="text"
                register={register("headline", {
                  maxLength: {
                    value: 255,
                    message: "Headline cannot exceed 255 characters",
                  },
                })}
                error={errors.headline ? errors.headline.message : ""}
              />

              <TextInput
                name="desc"
                label="Description"
                placeholder="Description"
                type="text"
                register={register("desc", {
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                })}
                error={errors.desc ? errors.desc.message : ""}
              />

              <TextInput
                name="birthday"
                label="Birthday"
                placeholder="YYYY-MM-DD"
                type="date"
                register={register("birthday", {
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Invalid date format",
                  },
                })}
                error={errors.birthday ? errors.birthday.message : ""}
              />

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Resume (PDF only, max 500MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onFileChange}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {uploading && <ClipLoader color="#4A90E2" size={20} />}
                {resumeLink && (
                  <div className="flex items-center gap-2">
                    <Tooltip title="Resume uploaded successfully">
                      <FilePdfOutlined
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      />
                    </Tooltip>
                    <Button type="link" danger onClick={handleDeleteResume}>
                      Delete Resume
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {errMsg && (
            <span role="alert" className="text-sm text-red-500 mt-0.5">
              {errMsg}
            </span>
          )}

          {loading ? (
            <div className="flex justify-center">
              <ClipLoader color="#4A90E2" size={35} />
            </div>
          ) : (
            <CustomButton
              type="submit"
              containerStyles="mt-4 inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800"
              title="Update Profile"
            />
          )}
        </form>
        {/* Fixed Close Button at the Bottom of the Modal */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-red-500 text-white hover:bg-red-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileModal;
