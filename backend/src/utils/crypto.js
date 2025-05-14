// const cryto = require("crypto");
import crypto from "crypto";
const Crypto = {
    generateToken: () => {
        return crypto.randomBytes(64).toString("hex");
    },
};

export default Crypto;
