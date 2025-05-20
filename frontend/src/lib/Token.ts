"use client";
let Token = "";

function setToken(token: string) {
    Token = token;
}
function getToken() {
    return Token;
}
export { setToken, getToken };
