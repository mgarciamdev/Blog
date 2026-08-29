import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/userContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccountSection = () => {

    const { clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = 
    return (
        <div>DeleteAccountSection</div>
    );
};

export default DeleteAccountSection;