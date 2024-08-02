import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select, message, DatePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { constants } from "../context/API/constants";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const UpdateProfileModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { userInfo, userType, emailVerified, token } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userInfo && userType === "seeker") {
      form.setFieldsValue({
        email: userInfo.email,
        phone: userInfo.phone,
        name: userInfo.name,
        gender: userInfo.gender !== null ? userInfo.gender.toString() : "",
        headline: userInfo.headline,
        desc: userInfo.desc,
        birthday: userInfo.birthday ? moment(userInfo.birthday) : null,
      });
    }
  }, [form, userInfo, userType]);

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const formattedValues = {
          ...values,
          birthday: values.birthday
            ? values.birthday.format("YYYY-MM-DD")
            : null,
        };
        const response = await axios.put(
          `${constants.BASE_URL}/seeker/update/${userInfo.user_id}`,
          formattedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Update successful:", response.data);

        const isEmailVerified = response.data?.email_verified_at ? "yes" : "no";

        dispatch(
          setCredentials({
            userInfo: response.data,
            userType: "seeker",
            emailVerified: isEmailVerified,
            token: token,
          })
        );
        message.success("User Data Updated Successfully");
        onClose(); // Close the modal after a successful update
      } catch (error) {
        message.error("Update failed");
      }
    });
  };

  const disabledDate = (current) => {
    // Disable dates after today
    return current && current > moment().endOf("day");
  };

  const renderSeekerForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input placeholder="Enter your name" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          { required: true, message: "Please enter your phone number" },
          {
            pattern: /^[\+][0-9]{11,14}$/,
            message: "Please enter a valid phone number",
          },
        ]}
      >
        <Input placeholder="Enter your phone number" />
      </Form.Item>
      <Form.Item name="gender" label="Gender">
        <Select placeholder="Select your gender">
          <Option value="">Prefer not to say</Option>
          <Option value="1">Male</Option>
          <Option value="2">Female</Option>
          <Option value="3">Other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="headline"
        label="Headline"
        rules={[{ required: false, max: 255, message: "Max 255 characters" }]}
      >
        <Input placeholder="Enter your headline" />
      </Form.Item>
      <Form.Item
        name="desc"
        label="Description"
        rules={[{ required: false, max: 500, message: "Max 500 characters" }]}
      >
        <Input.TextArea placeholder="Enter your description" rows={4} />
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Birthday"
        rules={[
          {
            required: false,
            message: "Please enter a valid date",
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          disabledDate={disabledDate}
          autoFocus:true
        />
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      title="Update Profile"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      {userType === "seeker" && renderSeekerForm()}
    </Modal>
  );
};

export default UpdateProfileModal;
