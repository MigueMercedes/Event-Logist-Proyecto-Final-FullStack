const capitalizeFirst = ([first, ...rest]) => first.toUpperCase() + rest.join('');

const capitalizeArrayOrString = (value) => {
    if (Array.isArray(value)) {
        return value.map((str) => capitalizeFirst(str));
    } else {
        return capitalizeFirst(value);
    }
};

export default capitalizeArrayOrString;
