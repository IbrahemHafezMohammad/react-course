import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tooltip,
  Modal,
  Badge,
  Pagination,
  Select,
  DatePicker,
  Input,
  Spin
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { constants } from "../context/API/constants";
import { DefaultImage } from "../assets"; // Add a default image asset
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

function SeekerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    createdAt: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [pagination.current]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        ...(filters.title && { title: filters.title }),
        ...(filters.status && { status: filters.status }),
        ...(filters.createdAt && {
          created_at: filters.createdAt.format("YYYY-MM-DD HH:mm:ss"),
        }),
      };

      const response = await axios.get(
        `${constants.BASE_URL}/seeker/jobs/applications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params,
        }
      );
      setApplications(response.data.applications.data);
      setPagination({
        current: response.data.applications.current_page,
        pageSize: response.data.applications.per_page,
        total: response.data.applications.total,
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    setPagination({ ...pagination, current: 1 });
    fetchApplications();
  };

  const showModal = (application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedApplication(null);
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      PENDING: "default",
      ACCEPTED: "green",
      REJECTED: "red",
    };
    return <Badge color={statusColors[status]} text={status} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by Title"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Filter by Status"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            style={{ width: "100%" }}
          >
            <Option value="">All</Option>
            <Option value="1">Pending</Option>
            <Option value="2">Accepted</Option>
            <Option value="3">Rejected</Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <DatePicker
            showTime
            placeholder="Applied at"
            value={filters.createdAt}
            onChange={(value) => handleFilterChange("createdAt", value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        {applications.map((application) => (
          <Col xs={24} md={12} lg={8} key={application.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={application.job_post.title}
                  src={application.job_post.image || DefaultImage}
                  style={{ height: "100px", objectFit: "cover" }}
                />
              }
              actions={[
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => showModal(application)}
                >
                  View Details
                </Button>,
              ]}
            >
              <Card.Meta
                title={application.job_post.title}
                description={
                  application.job_post.desc.length > 20
                    ? `${application.job_post.desc.substring(0, 20)}...`
                    : application.job_post.desc
                }
              />
              {renderStatusBadge(application.status_name)}
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={(page) => setPagination({ ...pagination, current: page })}
        style={{ marginTop: "16px", textAlign: "right" }}
      />

      {selectedApplication && (
        <Modal
          title={selectedApplication.job_post.title}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          <img
            alt={selectedApplication.job_post.title}
            src={selectedApplication.job_post.image || DefaultImage}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />
          <Title level={5} style={{ marginTop: "16px" }}>
            Description
          </Title>
          <Text>{selectedApplication.job_post.desc}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Employer
          </Title>
          <Text>{selectedApplication.job_post.employer.user.name}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Date
          </Title>
          <Text>{moment(selectedApplication.created_at).format("LLL")}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Job Posted Date
          </Title>
          <Text>
            {moment(selectedApplication.job_post.created_at).format("LLL")}
          </Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Status
          </Title>
          {renderStatusBadge(selectedApplication.status_name)}

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Message
          </Title>
          <Text>
            {selectedApplication.message || (
              <Text type="secondary">No application message provided</Text>
            )}
          </Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Resume
          </Title>
          <a
            href={selectedApplication.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </a>

          <Title level={5} style={{ marginTop: "16px" }}>
            Total Applications for this Job
          </Title>
          <Text>{selectedApplication.job_post.application_count}</Text>
        </Modal>
      )}
    </div>
  );
}

export default SeekerApplications;
