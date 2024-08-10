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
} from "antd";
import axios from "axios";
import { EyeOutlined } from "@ant-design/icons";
import { constants } from "../context/API/constants";
import { DefaultImage } from "../assets"; // Import the default image asset

const { Title, Text } = Typography;
const { Option } = Select;

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

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    setPagination({ ...pagination, current: 1 });
    fetchPosts();
  };

  const renderSkillsTags = (skills) => {
    return skills.map((skill) => (
      <Tag key={skill.id} color="blue">
        {skill.name}
      </Tag>
    ));
  };

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
                    onClick={() => {
                      /* Handle view details later */
                    }}
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
    </div>
  );
}

export default EmployerPosts;
