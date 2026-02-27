const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            tls: true,
            tlsAllowInvalidCertificates: true,
        });

        console.log("✅ DB Is Connected...");
    } catch (error) {
        console.error("❌ connectDbError:", error.message);
        process.exit(1); // stop server safely
    }
};

module.exports = connectDb;