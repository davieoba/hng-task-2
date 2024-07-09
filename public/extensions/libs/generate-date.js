"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const generateDate = () => {
    const randomDate = faker_1.faker.date.recent();
    const dd = String(randomDate.getDate()).padStart(2, "0");
    const mm = String(randomDate.getMonth() + 1).padStart(2, "0");
    const yyyy = String(randomDate.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
};
exports.default = generateDate;
