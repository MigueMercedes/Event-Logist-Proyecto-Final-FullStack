const noRepeatTypes = (dataTypes, value) => {
    if (dataTypes.includes(value)) {
        const copy = dataTypes.filter((type) => type !== value);
        copy.unshift(value);
        return copy;
    } else {
        return dataTypes;
    }
};

export default noRepeatTypes;
