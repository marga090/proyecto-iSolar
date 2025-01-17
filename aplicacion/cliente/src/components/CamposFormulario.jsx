import React from "react";

const EntradaTexto = ({ label, name, value, onChange, type, placeholder, error }) => {
    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <input
                className="campoTexto"
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
            />
            {error && <label className="error">{error}</label>}
        </div>
    );
};

const EntradaRadio = ({ label, name, options, value, onChange, error }) => {
    return (
        <div className="radio-group">
            <label className="nombreCampo">{label}</label>
            <div className="opciones">
                {options.map((option) => (
                    <div key={option.value} className="opcion">
                        <input
                            type="radio"
                            id={`${name}_${option.value}`}
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                        />
                        <label htmlFor={`${name}_${option.value}`}>{option.label}</label>
                    </div>
                ))}
            </div>
            {error && <label className="error">{error}</label>}
        </div>
    );
};

export {EntradaTexto, EntradaRadio};