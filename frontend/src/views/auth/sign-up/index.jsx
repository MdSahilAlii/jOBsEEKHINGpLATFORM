import AppLogo from '@/components/AppLogo';
import { Button, Card, CardBody, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, Row, Alert } from 'react-bootstrap';
import { appName, author, currentYear } from '@/helpers';
import { Link, useNavigate } from 'react-router';
import PasswordInputWithStrength from '@/components/PasswordInputWithStrength';
import { useState } from 'react';
import PageMeta from "@/components/PageMeta";
import { authAPI } from '@/services/api';

const Page = () => {
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return <>
            <PageMeta title="Sign Up" />

            <div className="auth-box overflow-hidden align-items-center d-flex">
                <Container>
                    <Row className="justify-content-center">
                        <Col xxl={4} md={6} sm={8}>
                            <Card>
                                <CardBody>
                                    <div className="auth-brand mb-4">
                                        <AppLogo />
                                        <p className="text-muted w-lg-75 mt-3">Let’s get you started. Create your
                                            account by
                                            entering your details below.</p>
                                    </div>

                                    {error && <Alert variant="danger">{error}</Alert>}
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userName">
                                                Name <span className="text-danger">*</span>
                                            </FormLabel>
                                            <FormControl 
                                                type="text" 
                                                id="userName" 
                                                placeholder="Damian D." 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required 
                                            />
                                        </FormGroup>

                                        <FormGroup className="mb-3">
                                            <FormLabel htmlFor="userEmail">
                                                Email <span className="text-danger">*</span>
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
                                            <PasswordInputWithStrength id="password" label="Password" name="password" password={password} setPassword={setPassword} placeholder="••••••••" />
                                        </FormGroup>

                                        <div className="mb-3">
                                            <FormCheck className="fs-14 mt-0" type="checkbox" label="Agree the Terms & Policy" />
                                        </div>

                                        <div className="d-grid">
                                            <Button variant="primary" type="submit" className="fw-semibold py-2" disabled={loading}>
                                                {loading ? 'Creating Account...' : 'Create Account'}
                                            </Button>
                                        </div>
                                    </Form>

                                    <p className="text-muted text-center mt-4 mb-0">
                                        Already have an account?{' '}
                                        <Link to="/auth/sign-in" className="text-decoration-underline link-offset-3 fw-semibold">
                                            Login
                                        </Link>
                                    </p>
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