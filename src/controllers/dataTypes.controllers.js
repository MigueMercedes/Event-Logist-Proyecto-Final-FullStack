import defaultTypesArray from '../models/defaultTypes.js';

export const sendJson = (req, res) => {
    res.json({ defaultTypesArray });
};
