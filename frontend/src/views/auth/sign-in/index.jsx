import { Button, Card, CardBody, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, Row, Alert } from 'react-bootstrap';
import AppLogo from '@/components/AppLogo';
import { appName, author, currentYear } from '@/helpers';
import { Link, useNavigate } from 'react-router';
import PageMeta from "@/components/PageMeta";
import { authAPI } from '@/services/api';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const Page = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(formData);
      
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return <>
            <PageMeta title="Sign In" />

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo />
                                        <p className="text-muted w-lg-75 mt-3">Let’s get you signed in. Enter your email
                                            and
                                            password to continue.</p>
                                    </div>

                                    <div className="">
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup className="mb-3">
                                                <FormLabel htmlFor="userEmail">
                                                    Email<span className="text-danger">*</span>
                                                </FormLabel>
                                                <FormControl 
                                                    type="email" 
                                                    id="userEmail" 
                                                    placeholder="you@example.com" 
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    required 
                                                />
                                            </FormGroup>

                                            <FormGroup className="mb-3">
                                                <FormLabel htmlFor="userPassword">
                                                    Password <span className="text-danger">*</span>
                                                </FormLabel>
                                                <FormControl 
                                                    type="password" 
                                                    id="userPassword" 
                                                    placeholder="••••••••" 
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    required 
                                                />
                                            </FormGroup>

                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <FormCheck className="fs-14" type="checkbox" label="Keep me signed in" />
                                                <Link to="/auth/reset-password" className="text-decoration-underline link-offset-3 text-muted">
                                                    Forgot Password?
                                                </Link>
                                            </div>

                                            <div className="d-grid">
                                                <Button variant="primary" type="submit" className="fw-semibold py-2" disabled={loading}>
                                                    {loading ? 'Signing In...' : 'Sign In'}
                                                </Button>
                                            </div>
                                        </Form>

                                        <p className="text-muted text-center mt-4 mb-0">
                                            New here?{' '}
                                            <Link to="/auth/sign-up" className="text-decoration-underline link-offset-3 fw-semibold">
                                                Create an account
                                            </Link>
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                            <p className="text-center text-muted mt-4 mb-0">
                                © {currentYear} {appName} — by <span className="fw-semibold">{author}</span>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>;
};
export default Page;