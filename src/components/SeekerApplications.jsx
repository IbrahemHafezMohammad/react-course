import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Typography, Tooltip, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { constants } from "../context/API/constants";

const { Title, Text } = Typography;

function SeekerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${constants.BASE_URL}/seeker/jobs/applications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setApplications(response.data.applications.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const showModal = (application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedApplication(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {applications.map((application) => (
          <Col key={application.id} xs={24} md={12} lg={8}>
            <Card
              hoverable
              cover={
                application.job_post.image && (
                  <img alt={application.job_post.title} src={application.job_post.image} />
                )
              }
            >
              <Title level={5}>{application.job_post.title}</Title>
              <Text>{application.job_post.desc.slice(0, 30)}...</Text>
              <Text>Status: {application.status_name}</Text>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => showModal(application)}
                style={{ marginTop: "10px" }}
              >
                View
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

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
          <Title level={5}>Description</Title>
          <Text>{selectedApplication.job_post.desc}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Employer
          </Title>
          <Text>{selectedApplication.job_post.employer.user.name}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Date
          </Title>
          <Text>{new Date(selectedApplication.created_at).toLocaleString()}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Job Posted Date
          </Title>
          <Text>{new Date(selectedApplication.job_post.created_at).toLocaleString()}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Status
          </Title>
          <Text>{selectedApplication.status_name}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Message
          </Title>
          <Text>{selectedApplication.message}</Text>

          <Title level={5} style={{ marginTop: "16px" }}>
            Application Resume
          </Title>
          <a href={selectedApplication.resume} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        </Modal>
      )}
    </>
  );
}

export default SeekerApplications;
