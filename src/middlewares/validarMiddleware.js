export const validateMid = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        if (error.issues) {
        return res.status(400).json(
            error.issues.map((issue) => issue.message)
        );
    }
    return res.status(500).json({ message: "Error interno en el middleware de validación" });
}
};