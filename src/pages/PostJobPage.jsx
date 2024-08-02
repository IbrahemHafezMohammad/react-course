import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { useSelector } from "react-redux";
import axios from 'axios';
import { constants } from '../context/API/constants';

const { Option } = Select;

function PostJobPage() {
  const [skills, setSkills] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [fileList, setFileList] = useState([]); // Manage file list for the upload
  const [form] = Form.useForm();
  const { userInfo, userType, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch skills for dropdown
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${constants.BASE_URL}/skills/dropdown`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          },
        );
        setSkills(response.data.length > 0 ? response.data : []); // Handle empty skills array
      } catch (error) {
        console.log('error ', error);
        setSkills([]); // Set empty array if fetching fails
      }
    };

    fetchSkills();
  }, []);

  const onImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${constants.BASE_URL}/upload/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      setImageLink(response.data.link);
      setUploadedImage(URL.createObjectURL(file));

      // Update file list with the latest file
      setFileList([file]);

      message.success("Image uploaded successfully");
    } catch (error) {
      message.error("Failed to upload image");
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE; // Prevent non-image files from being uploaded
    }
    onImageUpload(file); // Proceed with the upload if it's an image
    return false;
  };

  const handleRemove = () => {
    setFileList([]);
    setUploadedImage(null);
    setImageLink(null);
    message.success("Image removed successfully");
  };

  const onFinish = async (data) => {
    console.log('data: ', data)
    const jobData = {
      ...data,
      image: imageLink, // Set the image link obtained from the upload
      skills: data.skills.map(skillId => parseInt(skillId)), // Convert skills to an array of IDs
    };

    try {
      const response = await axios.post(`${constants.BASE_URL}/employer/jobs/post`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      message.success("Job posted successfully");
    } catch (error) {
      message.error("Failed to post job");
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          { required: true, message: 'Title is required' },
          { min: 1, max: 255, message: 'Title must be between 1 and 255 characters' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="desc"
        rules={[
          { required: true, message: 'Description is required' },
          { min: 50, max: 3000, message: 'Description must be between 50 and 3000 characters' }
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Skills"
        name="skills"
        rules={[{ required: true, message: 'Please select at least one skill' }]}
      >
        <Select
          mode="multiple"
          allowClear
          placeholder={skills.length > 0 ? "Select skills" : "No skills available"}
          options={skills.map(skill => ({ value: skill.id, label: skill.name }))}
          disabled={skills.length === 0} // Disable dropdown if no skills available
        />
      </Form.Item>

      <Form.Item label="Image">
        <Upload
          name="image"
          listType="picture"
          beforeUpload={beforeUpload}
          onRemove={handleRemove} // Handle removal of images
          fileList={fileList} // Ensure only one file is shown in the list
          accept="image/*" // Restrict to image files only
        >
          <Button>Click to upload</Button>
        </Upload>
        {uploadedImage && (
          <img src={uploadedImage} alt="Uploaded Preview" style={{ marginTop: '10px', maxHeight: '200px' }} />
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="mt-6 w-full">
          Post Job
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PostJobPage;
