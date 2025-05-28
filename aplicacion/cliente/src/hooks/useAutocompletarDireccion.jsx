import { useState, useCallback, useRef } from 'react';

const nominatimURL = 'https://nominatim.openstreetmap.org/search';
const comunidadesAutonomas = [
    'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
    'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
    'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia',
    'Navarra', 'País Vasco', 'Valencia'
];

const espanaViewbox = '-9.392883,35.946850,3.039484,43.748337';

const construirURL = (query) => {
    const params = new URLSearchParams({
        format: 'json',
        addressdetails: '1',
        limit: '15',
        countrycodes: 'es',
        dedupe: '1',
        'accept-language': 'es',
        extratags: '1',
        viewbox: espanaViewbox,
        bounded: '1',
        q: query,
    });
    return `${nominatimURL}?${params.toString()}`;
};

const obtenerProvincia = (address, displayName) => {
    if (address.province) return address.province;
    if (address.county) return address.county;
    if (address.state && !comunidadesAutonomas.some(ca => address.state.toLowerCase().includes(ca.toLowerCase()))) {
        return address.state;
    }
    const partes = displayName.split(',').map(p => p.trim());
    return partes.reverse().find(p =>
        p && !/^\d/.test(p) && p !== 'España' && p !== 'Spain' && p.length > 2
    ) || '';
};

const formatearDireccion = (item, numero) => {
    const address = item.address || {};
    const nombreCalle = address.road || address.pedestrian || item.display_name.split(',')[0] || '';
    const numeroCalle = numero && !nombreCalle.includes(numero) ? numero : address.house_number;
    const direccion = numeroCalle ? `${nombreCalle}, ${numeroCalle}` : nombreCalle;

    return {
        direccion,
        localidad: address.city || address.town || address.village || address.municipality || '',
        provincia: obtenerProvincia(address, item.display_name),
        displayName: item.display_name,
        completo: item,
        tieneNumero: !!(numeroCalle)
    };
};

export const useAutocompletarDireccion = () => {
    const [sugerencias, setSugerencias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    const buscarDirecciones = useCallback((query) => {
        if (query.length < 3) {
            setSugerencias([]);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        timeoutRef.current = setTimeout(async () => {
            setIsLoading(true);

            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const queries = [query, query.replace(/\d+/g, '').trim()];
                const responses = await Promise.all(
                    queries.map(q => fetch(construirURL(q), {
                        headers: { 'User-Agent': 'Insene/1.0' },
                        signal
                    }).then(res => res.json()))
                );

                const todosResultados = [...responses[0], ...responses[1]];
                const numero = query.match(/\d+/)?.[0] || '';

                const direcciones = todosResultados
                    .map(item => formatearDireccion(item, numero))
                    .filter((item, index, self) =>
                        index === self.findIndex(t => t.direccion === item.direccion)
                    )
                    .sort((a, b) => b.tieneNumero - a.tieneNumero)
                    .slice(0, 15);

                setSugerencias(direcciones);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setSugerencias([]);
                }
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, []);

    const limpiarSugerencias = useCallback(() => setSugerencias([]), []);

    return { sugerencias, isLoading, buscarDirecciones, limpiarSugerencias };
};
