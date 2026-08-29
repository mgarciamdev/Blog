import React from 'react'
import AuthInput from '../../../components/Inputs/AuthInput';

const CurrentPasswordField = ({ password, setPassword }) => {

    return (
        <div>
            <AuthInput 
                value={password}
                onChange={({target}) => {
                    setPassword(target.value);
                }}
                label="Contraseña actual"
                placeholder="Ingresa tu contraseña actual"
                type="password"
            />
        </div>
    )
}

export default CurrentPasswordField