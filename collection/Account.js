const mongoose = require('mongoose');

const atlasUri = 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/dudz';

mongoose.connect(atlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB Atlas (Accounts)");
    })
    .catch((e) => {
        console.error("Error connecting to MongoDB Atlas:", e);
    });

const mySchema = new mongoose.Schema({
    Username: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Password: {
        type: Object,
        require: true
    },
    Position: {
        type: String,
        require: true
    },
    Sex: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        require: true
    },
    LogIn: {
        type: String,
        require: true
    },
    LoggedOut: {
        type: String,
        require: true
    },
    Uid: {
        type: String,
        require: true
    },
});

const Menu = mongoose.model('account', mySchema);

module.exports = Menu;