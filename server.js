const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
const mqtt = require('mqtt');

// --- TAMBAHAN: Global Error Handler ---
process.on('uncaughtException', (err) => {
    console.error('!!! CRASH FATAL (Uncaught Exception):', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!! CRASH FATAL (Unhandled Rejection):', reason);
    process.exit(1);
});
// -------------------------------------

const client = mqtt.connect('mqtts://USER:PASS@CLUSTER_URL:8883'); 

client.on('connect', () => {
    console.log('Terkoneksi ke MQTT Broker');
    client.subscribe('pju/test');
});

client.on('message', (topic, message) => {
    console.log('MQTT Message:', message.toString());
    io.emit('data', message.toString());
});

io.on('connection', (socket) => {
    console.log('User terhubung ke Web Dashboard');
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));