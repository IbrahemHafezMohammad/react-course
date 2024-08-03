import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Row,
  Col,
  Pagination,
  Select,
  Input,
  Form,
  Spin,
  Tag,
  Upload,
  message as antdMessage,
} from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { constants } from "../context/API/constants";
import { DefaultImage } from "../assets"; // Import the default image

const { Option } = Select;
const { TextArea } = Input;

function ListJobsPage() {
  const { token, userInfo } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApplyVisible, setIsApplyVisible] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2); // Assuming 2 items per page as per your response
  const [filters, setFilters] = useState({
    title: "",
    employer: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [resumeLink, setResumeLink] = useState(null); // For storing the uploaded resume link

  const fetchJobs = async () => {
    setLoading(true);
    console.log("currentPage :", currentPage)
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/seeker/jobs/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            ...filters,
          },
        }
      );
      const data = response.data.posts;
      setJobs(data.data);
      setTotalJobs(data.total);
      setPageSize(data.per_page);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token, currentPage]);

  useEffect(() => {
    // Fetch skills for dropdown
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${constants.BASE_URL}/skills/dropdown`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSkills(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.log("Error fetching skills:", error);
        setSkills([]);
      }
    };

    fetchSkills();
  }, [token]);

  const showModal = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
    setIsApplyVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
    setResumeLink(null); // Reset resume link when closing modal
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (changedValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...changedValues,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters are applied
    fetchJobs(); // Refetch jobs with new filters
  };

  const handleApplyClick = () => {
    setIsApplyVisible(true);
  };

  const handleResumeUpload = async (file) => {
    const isPdf = file.type === "application/pdf";
    const isLt500M = file.size / 1024 / 1024 < 500;

    if (!isPdf) {
      antdMessage.error("You can only upload PDF files!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt500M) {
      antdMessage.error("File must be smaller than 500MB!");
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", "resumes");

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
      antdMessage.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      antdMessage.error("Failed to upload resume.");
    }

    return false; // Prevent default upload behavior
  };

  const handleApplySubmit = async (values) => {
    try {
      await axios.post(
        `${constants.BASE_URL}/seeker/jobs/apply`,
        {
          job_post_id: selectedJob.id,
          resume: resumeLink || userInfo.resume,
          message: values.message || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      antdMessage.success("Applied successfully!");
      handleCloseModal();
      applyFilters()
    } catch (error) {
      console.error("Error applying for job:", error);
      antdMessage.error("Failed to apply for job.");
    }
  };

  return (
    <div className="p-6">
      {/* Filter Section */}
      <Form
        layout="inline"
        onValuesChange={handleFilterChange}
        onFinish={applyFilters}
      >
        <Form.Item name="title">
          <Input placeholder="Job Title" />
        </Form.Item>
        <Form.Item name="employer">
          <Input placeholder="Employer" />
        </Form.Item>
        <Form.Item name="skills">
          <Select
            mode="multiple"
            placeholder="Select Skills"
            style={{ minWidth: 200 }}
            allowClear
          >
            {skills.map((skill) => (
              <Option key={skill.id} value={skill.id}>
                {skill.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Apply Filters
          </Button>
        </Form.Item>
      </Form>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center mt-6">
          <h3>No Jobs Available</h3>
        </div>
      ) : (
        <>
          {/* Jobs Listing */}
          <Row gutter={[16, 16]} className="mt-4">
            {jobs.map((job) => (
              <Col xs={24} md={12} lg={8} key={job.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={job.title}
                      src={job.image || DefaultImage}
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  } // Use default image if none
                  actions={[
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => showModal(job)}
                    >
                      View Details
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={job.title}
                    description={
                      job.desc.length > 30
                        ? `${job.desc.substring(0, 30)}...`
                        : job.desc
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            total={totalJobs}
            pageSize={pageSize}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          title={selectedJob.title}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={
            isApplyVisible ? null : (
              <Button key="apply" type="primary" onClick={handleApplyClick}>
                Apply
              </Button>
            )
          }
        >
          <img
            alt={selectedJob.title}
            src={selectedJob.image || DefaultImage}
            style={{ width: "100%", marginBottom: "16px" }}
          />{" "}
          {/* Use default image if none */}
          <p>
            <strong>Description:</strong> {selectedJob.desc}
          </p>
          <p>
            <strong>Employer:</strong> {selectedJob.employer.user.name}
          </p>
          <p>
            <strong>Skills:</strong>
          </p>
          <div>
            {selectedJob.skills.map((skill) => (
              <Tag key={skill.id} color="blue">
                {skill.name}
              </Tag>
            ))}
          </div>
          {isApplyVisible && (
            <Form
              layout="vertical"
              onFinish={handleApplySubmit}
              className="mt-4"
            >
              {userInfo.resume && (
                <Form.Item>
                  <Button onClick={() => setResumeLink(userInfo.resume)}>
                    Apply with my existing resume
                  </Button>
                </Form.Item>
              )}

              <Form.Item label="Resume" required>
                <Upload
                  beforeUpload={handleResumeUpload}
                  maxCount={1}
                  accept=".pdf"
                >
                  <Button icon={<UploadOutlined />}>Upload Resume</Button>
                </Upload>
                {resumeLink && <p>Resume uploaded successfully!</p>}
              </Form.Item>

              <Form.Item name="message" label="Message (Optional)">
                <TextArea rows={4} maxLength={500} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Submit Application
                </Button>
              </Form.Item>
            </Form>
          )}
          <Button key="close" onClick={handleCloseModal} className="mt-4" block>
            Close
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default ListJobsPage;
