const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mqtt = require('mqtt');

// Koneksi ke MQTT Broker
const client = mqtt.connect('mqtts://USER:PASS@CLUSTER_URL:8883'); 

client.on('connect', () => client.subscribe('pju/test'));

client.on('message', (topic, message) => {
  console.log('Data diterima:', message.toString());
  io.emit('data', message.toString()); // Kirim ke web UI
});

app.use(express.static('public'));
http.listen(process.env.PORT || 3000, () => console.log('Server berjalan'));