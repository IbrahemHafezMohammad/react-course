import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag } from 'antd';

const { Title, Text } = Typography;

function DashboardPage() {
  const navigate = useNavigate();
  const { userInfo, userType, emailVerified } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <Row justify="start">
        <Col xs={24} md={12} lg={8}>
          <Card
            title="User Information"
            bordered={false}
            style={{ width: '100%', height: '90vh' }}
          >
            <div className="space-y-6">
              <Title level={5}>Name:</Title>
              <Text>{userInfo.name || <Text type="secondary">No name provided</Text>}</Text>

              <Title level={5}>Email:</Title>
              <Text>{userInfo.email || <Text type="secondary">No email provided</Text>}</Text>
              {emailVerified === 'yes' ? (
                <Tag color="green" style={{ marginLeft: '8px' }}>Verified</Tag>
              ) : (
                <>
                  <a href="/verify-email" style={{ marginLeft: '8px', color: '#1890ff' }}>Please verify email</a>
                  <Text type="danger" style={{ display: 'block', marginTop: '4px' }}>
                    Please verify your email to use our system features
                  </Text>
                </>
              )}

              <Title level={5}>Phone:</Title>
              <Text>{userInfo.phone || <Text type="secondary">No phone number provided</Text>}</Text>

              <Title level={5}>Birthday:</Title>
              <Text>{userInfo.birthday || <Text type="secondary">No birthday provided</Text>}</Text>

              <Title level={5}>Gender:</Title>
              <Text>{userInfo.gender_name || <Text type="secondary">No gender information provided</Text>}</Text>

              {userType !== 'employer' && (
                <>
                  <Title level={5}>Headline:</Title>
                  <Text>{userInfo.headline || <Text type="secondary">No headline provided</Text>}</Text>

                  <Title level={5}>Description:</Title>
                  <Text>{userInfo.desc || <Text type="secondary">No description provided</Text>}</Text>
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
