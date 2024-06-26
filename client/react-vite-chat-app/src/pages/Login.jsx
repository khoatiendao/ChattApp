import { useContext, useState } from "react";
import { Alert, Button, Form, Col, Stack, Row } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React from 'react';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const {
        logoutUser,
        loginUser,
        loginInfo,
        loginError,
        updateLoginInfo,
        isLoginLoading } = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>

                            <Form.Control type="email" placeholder="Email" required onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })} />
                            <div className="dad-flex-input">
                                <div className="flex-input">
                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" required onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })} />
                                    <span onClick={toggleShowPassword}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            
                            
                            <Button variant="primary" type="submit">
                                {isLoginLoading ? "Wait a minute" : "Login"}
                            </Button>

                            {loginError?.error && (
                                <Alert variant="danger">
                                    <p>{loginError?.message}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Login;