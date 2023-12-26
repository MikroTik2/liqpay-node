const app = require('./app');
const dbConnect = require('./config/dbConnect.js');
const cloudinary = require('cloudinary');
const PORT = process.env.PORT || process.env.PORT_NODE;

dbConnect();

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
     console.log(`Error: ${err.message}`);
     server.close(() => {
          process.exit(1);
     });
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
    console.log(`==> Server running on http://localhost:${PORT}`)
});