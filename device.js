
// virtual-hardware/device.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

const TOPIC_COMMAND = 'ethio_home/command';

client.on('connect', () => {
    console.log('🟢 [SMART HOME DEVICE] Connected to MQTT Broker');
    client.subscribe(TOPIC_COMMAND, (err) => {
        if (!err) console.log(`📡 Listening for commands on: ${TOPIC_COMMAND}`);
    });
});

client.on('message', (topic, message) => {
    if (topic === TOPIC_COMMAND) {
        const cmd = JSON.parse(message.toString());
        console.log(`⚡ Received command:`, cmd);
        
        if (cmd.device === 'light1') {
            console.log(cmd.action === 'ON' ? '💡 [ACTION] Living Room Light is ON' : '🌑 [ACTION] Living Room Light is OFF');
        } else if (cmd.device === 'fan1') {
            console.log(cmd.action === 'ON' ? '🌀 [ACTION] Bedroom Fan is ON' : '💨 [ACTION] Bedroom Fan is OFF');
        }
    }
});