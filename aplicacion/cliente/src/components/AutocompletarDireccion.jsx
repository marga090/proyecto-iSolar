import { useState, useRef, useEffect } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useAutocompletarDireccion } from '../hooks/useAutocompletarDireccion';

const AutocompletarDireccion = ({
    label,
    name,
    placeholder,
    tooltip,
    errors,
    touched,
    value = '',
    onChange,
    onSelect
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const { sugerencias, isLoading, buscarDirecciones, limpiarSugerencias } = useAutocompletarDireccion();
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!containerRef.current?.contains(e.target)) setMostrarSugerencias(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(e);

        if (val.trim()) {
            buscarDirecciones(val);
            setMostrarSugerencias(true);
        } else {
            limpiarSugerencias();
            setMostrarSugerencias(false);
        }
    };

    const handleSelect = (sugerencia) => {
        setInputValue(sugerencia.direccion);
        setMostrarSugerencias(false);
        limpiarSugerencias();

        onSelect?.(sugerencia);
        onChange({ target: { name, value: sugerencia.direccion } });
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <Form.Group className>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    title={tooltip}
                    isInvalid={touched && errors}
                    autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
            </Form.Group>

            {(mostrarSugerencias && (sugerencias.length > 0 || isLoading)) && (
                <ListGroup
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 400,
                        overflowY: 'auto',
                        borderRadius: 6,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.075)'
                    }}
                >
                    {isLoading && <ListGroup.Item disabled>🔍 Buscando direcciones...</ListGroup.Item>}
                    {sugerencias.map((s, i) => (
                        <ListGroup.Item
                            key={i}
                            action
                            onClick={() => handleSelect(s)}
                            style={{ cursor: 'pointer', fontSize: 14.4 }}
                        >
                            <strong>
                                {s.direccion} {s.tieneNumero && <span className="text-success">✓</span>}
                            </strong>
                            <br />
                            <small className="text-muted">
                                {s.localidad && `${s.localidad}, `}{s.provincia}
                            </small>
                            {!s.tieneNumero && <small className="text-info d-block">💡 Dirección, número</small>}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default AutocompletarDireccion;
