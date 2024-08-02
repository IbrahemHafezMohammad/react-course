import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Row, Col, Pagination, Select, Input, Form, Spin, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { constants } from '../context/API/constants';

const { Option } = Select;

function ListJobsPage() {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2); // Assuming 2 items per page as per your response
  const [filters, setFilters] = useState({
    title: '',
    employer: '',
    skills: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch jobs with filters and pagination
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${constants.BASE_URL}/seeker/jobs/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            ...filters,
          },
        });
        const data = response.data.posts;
        setJobs(data.data);
        setTotalJobs(data.total);
        setPageSize(data.per_page);
        setCurrentPage(data.current_page);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, currentPage]);

  useEffect(() => {
    // Fetch skills for dropdown
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${constants.BASE_URL}/skills/dropdown`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSkills(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.log('Error fetching skills:', error);
        setSkills([]);
      }
    };

    fetchSkills();
  }, [token]);

  const showModal = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
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
    setLoading(true);
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${constants.BASE_URL}/seeker/jobs/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 1,
            ...filters,
          },
        });
        const data = response.data.posts;
        setJobs(data.data);
        setTotalJobs(data.total);
        setPageSize(data.per_page);
        setCurrentPage(data.current_page);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  };

  return (
    <div className="p-6">
      {/* Filter Section */}
      <Form layout="inline" onValuesChange={handleFilterChange} onFinish={applyFilters}>
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
      ) : (
        <>
          {/* Jobs Listing */}
          <Row gutter={[16, 16]} className="mt-4">
            {jobs.map((job) => (
              <Col xs={24} md={12} lg={8} key={job.id}>
                <Card
                  hoverable
                  cover={<img alt={job.title} src={job.image} style={{ height: '100px', objectFit: 'cover' }} />}
                  actions={[
                    <Button icon={<EyeOutlined />} onClick={() => showModal(job)}>
                      View Details
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={job.title}
                    description={job.desc.length > 30 ? `${job.desc.substring(0, 30)}...` : job.desc}
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
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
        >
          <img alt={selectedJob.title} src={selectedJob.image} style={{ width: '100%', marginBottom: '16px' }} />
          <p><strong>Description:</strong> {selectedJob.desc}</p>
          <p><strong>Employer:</strong> {selectedJob.employer.user.name}</p>
          <p><strong>Skills:</strong></p>
          <div>
            {selectedJob.skills.map((skill) => (
              <Tag key={skill.id} color="blue">
                {skill.name}
              </Tag>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ListJobsPage;
