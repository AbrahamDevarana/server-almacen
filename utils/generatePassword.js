

function generatePassword ( length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        let randomNum = Math.floor(Math.random() * chars.length);
        password += chars[randomNum];
    }
    return password;
}

module.exports = {
    generatePassword
}