import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { constants } from '../context/API/constants';

const { Option } = Select;

function PostJobPage() {
  const { handleSubmit, setValue, formState: { errors } } = useForm();
  const [skills, setSkills] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch skills for dropdown
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${constants.BASE_URL}/skills`);
        console.log(response);
        setSkills(response.data.length > 0 ? response.data : []); // Handle empty skills array
      } catch (error) {
        setSkills([]); // Set empty array if fetching fails
      }
    };

    fetchSkills();
  }, []);

  const onImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageLink(response.data.link);
      setUploadedImage(URL.createObjectURL(file));
      return false;
    } catch (error) {
      message.error("Failed to upload image");
      return false;
    }
  };

  const onSubmit = async (data) => {
    const jobData = {
      ...data,
      image: imageLink, // Set the image link obtained from the upload
      skills: data.skills.map(skill => skill.value) // Convert skills to an array of IDs
    };

    try {
      const response = await axios.post('employer/jobs/post', jobData);
      message.success("Job posted successfully");
    } catch (error) {
      message.error("Failed to post job");
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit(onSubmit)}
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
          beforeUpload={onImageUpload}
          accept="image/*"
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
