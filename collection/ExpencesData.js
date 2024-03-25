const mongoose = require('mongoose');

const atlasUri = 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/dudz';

mongoose.connect(atlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB Atlas (ExpencesData)");
    })
    .catch((e) => {
        console.error("Error connecting to MongoDB Atlas:", e);
    });

const mySchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    Position: {
        type: Object,
        require: true
    },
    data: {
        type: Object,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    Uid: {
        type: String,
        require: true
    },
});

const ExpencesData = mongoose.model('ExpencesData', mySchema);

module.exports = ExpencesData;