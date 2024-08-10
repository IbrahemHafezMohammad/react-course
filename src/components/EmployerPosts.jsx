import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Pagination,
  Select,
  DatePicker,
  Input,
  Spin,
  Tag,
  Form,
  Modal,
  Table,
  Switch,
  message,
  Tooltip,
} from "antd";
import axios from "axios";
import { EyeOutlined } from "@ant-design/icons";
import { constants } from "../context/API/constants";
import { DefaultImage } from "../assets"; // Import the default image asset

const { Title, Text } = Typography;

function EmployerPosts() {
  const [posts, setPosts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    skills: [],
    createdAt: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsPagination, setApplicationsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [responding, setResponding] = useState(null);
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    fetchPosts();
    fetchSkills();
  }, [pagination.current]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/skills/dropdown`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        ...(filters.title && { title: filters.title }),
        ...(filters.createdAt && {
          created_at: filters.createdAt.format("YYYY-MM-DD HH:mm:ss"),
        }),
        ...(filters.skills.length > 0 && { skills: filters.skills }),
      };

      const response = await axios.get(
        `${constants.BASE_URL}/employer/jobs/list/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params,
        }
      );

      const data = response.data.posts;
      setPosts(data.data);
      setPagination({
        current: data.current_page,
        pageSize: data.per_page,
        total: data.total,
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch job posts:", error);
      setLoading(false);
    }
  };

  const fetchApplications = async (postId, page = 1) => {
    setApplicationsLoading(true);
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/employer/jobs/list/applications/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page,
          },
        }
      );

      const data = response.data.applications;
      setApplications(data.data);
      setApplicationsPagination({
        current: data.current_page,
        pageSize: data.per_page,
        total: data.total,
      });
      setApplicationsLoading(false);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplicationsLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    setPagination({ ...pagination, current: 1 });
    fetchPosts();
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    fetchApplications(post.id);
    setIsModalVisible(true);
  };

  const handleToggleJobStatus = async (postId) => {
    try {
      await axios.post(
        `${constants.BASE_URL}/employer/jobs/post/toggle/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Job status updated successfully");
      setSelectedPost((prevPost) => ({
        ...prevPost,
        status_name: prevPost.status_name === "OPENED" ? "CLOSED" : "OPENED",
      }));
      fetchPosts(); // Refresh posts to reflect the new status
    } catch (error) {
      console.error("Failed to toggle job status:", error);
      message.error("Failed to update job status");
    }
  };

  const handleRespond = async (applicationId, isAccepted) => {
    setResponding(applicationId);
    try {
      await axios.post(
        `${constants.BASE_URL}/employer/jobs/application/respond`,
        {
          job_application_id: applicationId,
          is_accepted: isAccepted,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success(
        `Application ${isAccepted ? "accepted" : "rejected"} successfully`
      );

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status_name: isAccepted ? "ACCEPTED" : "REJECTED",
              }
            : application
        )
      );
    } catch (error) {
      console.error("Failed to respond to application:", error);
      message.error("Failed to respond to application");
    } finally {
      setResponding(null);
    }
  };

  const handleShowMessageModal = (message) => {
    setMessageModal({
      visible: true,
      message,
    });
  };

  const renderSkillsTags = (skills) => {
    return skills.map((skill) => (
      <Tag key={skill.id} color="blue">
        {skill.name}
      </Tag>
    ));
  };

  const columns = [
    {
      title: "Seeker Name",
      dataIndex: ["seeker", "user", "name"],
      key: "name",
    },
    {
      title: "User Name",
      dataIndex: ["seeker", "user", "user_name"],
      key: "user_name",
    },
    {
      title: "Email",
      dataIndex: ["seeker", "user", "email"],
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: ["seeker", "user", "phone"],
      key: "phone",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message) => (
        <Tooltip title="Click to view full message">
          <span onClick={() => handleShowMessageModal(message)}>
            {message ? message.substring(0, 20) + "..." : "No message provided"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Resume",
      dataIndex: "resume",
      key: "resume",
      render: (resume) => (
        <a href={resume} target="_blank" rel="noopener noreferrer">
          View Resume
        </a>
      ),
    },
    {
      title: "Respond",
      key: "respond",
      render: (_, application) => {
        if (application.status_name === "PENDING") {
          return responding === application.id ? (
            <Spin />
          ) : (
            <>
              <Button
                type="primary"
                style={{ marginBottom: "8px" }}
                block
                onClick={() => handleRespond(application.id, true)}
              >
                ACCEPT
              </Button>
              <Button
                type="primary"
                danger
                block
                onClick={() => handleRespond(application.id, false)}
              >
                REJECT
              </Button>
            </>
          );
        }
        return application.status_name;
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg"
      style={{
        height: "calc(100vh - 60px)",
        overflowY: "auto",
      }}
    >
      <Title level={3} style={{ marginBottom: "16px" }}>
        My Job Posts
      </Title>

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
            mode="multiple"
            allowClear
            placeholder={
              skills.length > 0 ? "Select skills" : "No skills available"
            }
            options={skills.map((skill) => ({
              value: skill.id,
              label: skill.name,
            }))}
            disabled={skills.length === 0} // Disable dropdown if no skills available
            value={filters.skills}
            onChange={(value) => handleFilterChange("skills", value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} md={8}>
          <DatePicker
            showTime
            placeholder="Created at"
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

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Title level={4}>No job posts available</Title>
        </div>
      ) : (
        <Row gutter={[16, 16]} className="mt-4">
          {posts.map((post) => (
            <Col xs={24} md={12} lg={8} key={post.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={post.title}
                    src={post.image || DefaultImage}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(post)}
                  >
                    View Details
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={post.title}
                  description={
                    post.desc.length > 20
                      ? `${post.desc.substring(0, 20)}...`
                      : post.desc
                  }
                />
                <div style={{ marginTop: "8px" }}>
                  {renderSkillsTags(post.skills)}
                </div>
                <Text strong>Status: </Text>
                {post.status_name}
                <br />
                <Text strong>Applications: </Text>
                {post.application_count}
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={(page) => setPagination({ ...pagination, current: page })}
        style={{ marginTop: "36px", textAlign: "right" }}
      />

      {selectedPost && (
        <Modal
          title={selectedPost.title}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={1000} // Make the modal wider
        >
          <img
            alt={selectedPost.title}
            src={selectedPost.image || DefaultImage}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />

          <div style={{ marginTop: "16px" }}>
            <Text strong>Description: </Text>
            <Text>{selectedPost.desc}</Text>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Text strong>Skills: </Text>
            {renderSkillsTags(selectedPost.skills)}
          </div>

          <div style={{ marginTop: "16px" }}>
            <Text strong>Status: </Text>
            <Switch
              checked={selectedPost.status_name === "OPENED"}
              onChange={() => handleToggleJobStatus(selectedPost.id)}
              checkedChildren="OPENED"
              unCheckedChildren="CLOSED"
              style={{ marginLeft: "8px" }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={applications}
            rowKey="id"
            loading={applicationsLoading}
            style={{ marginTop: "24px" }}
            pagination={{
              current: applicationsPagination.current,
              pageSize: applicationsPagination.pageSize,
              total: applicationsPagination.total,
              onChange: (page) => fetchApplications(selectedPost.id, page),
            }}
          />
        </Modal>
      )}

      <Modal
        title="Full Message"
        open={messageModal.visible}
        onCancel={() => setMessageModal({ visible: false, message: "" })}
        footer={null}
        style={{ maxWidth: "80%" }}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Text>{messageModal.message}</Text>
        </div>
      </Modal>
    </div>
  );
}

export default EmployerPosts;
