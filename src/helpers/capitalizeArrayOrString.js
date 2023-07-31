// Convierte la primera letra de un string a mayuscula
const capitalizeFirst = ([first, ...rest]) => first.toUpperCase() + rest.join('');

// Si es un string convierte cada primera letra de cada string y si no devuelve un string con la primera letra mayusc
const capitalizeArrayOrString = (value) => {
    if (Array.isArray(value)) {
        return value.map((str) => capitalizeFirst(str.trim()));
    } else {
        return capitalizeFirst(value.trim());
    }
};

export default capitalizeArrayOrString;
