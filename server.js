const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
const mqtt = require('mqtt');

// Konfigurasi PORT (Wajib menggunakan process.env.PORT dari Railway)
const PORT = process.env.PORT || 8080;

// Setup Health Check agar Railway tidak menganggap aplikasi mati
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use(express.static('public'));

// Setup MQTT dengan error handling agar tidak membuat server crash
const client = mqtt.connect(process.env.MQTT_URL); 

client.on('connect', () => {
    console.log('Terkoneksi ke MQTT Broker');
    client.subscribe('pju/test');
});

client.on('error', (err) => {
    console.error('MQTT Error:', err);
});

client.on('message', (topic, message) => {
    console.log('Data MQTT:', message.toString());
    io.emit('data', message.toString());
});

io.on('connection', (socket) => {
    console.log('User terhubung ke Web Dashboard');
});

// Bind ke 0.0.0.0 dan port yang benar
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
});