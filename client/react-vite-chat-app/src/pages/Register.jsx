
import { useContext, useState } from "react";
import { Alert, Button, Form, Col, Stack, Row } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import React from 'react';
import "../assets/css/Register.css";

const Register = () => {

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext)

    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>

                            <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />
                            <Form.Control type="email" placeholder="Email" onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />
                            <div className="dad-flex-input">
                                <div className="flex-input">
                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />
                                    <span onClick={toggleShowPassword}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            <Button variant="primary" type="submit">
                                {isRegisterLoading ? "Creating your account" : "Register"}
                            </Button>
                            {registerError?.error && (
                                <Alert variant="danger">
                                    <p>{registerError?.message}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Register;