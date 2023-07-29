const parseNumberOrArray = (value) => (Array.isArray(value) ? value.map(Number) : Number(value));

export default parseNumberOrArray;
