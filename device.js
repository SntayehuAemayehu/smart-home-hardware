// virtual-hardware/device.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

const TOPIC_DATA = 'health/device1/data';
const TOPIC_COMMAND = 'health/device1/command';

client.on('connect', () => {
    console.log('🟢 [HARDWARE] Connected to MQTT Broker');
    
    // Listen for commands from Django
    client.subscribe(TOPIC_COMMAND, (err) => {
        if (!err) console.log(`📡 [HARDWARE] Listening for commands on: ${TOPIC_COMMAND}`);
    });

    // Simulate reading sensors every 5 seconds
    setInterval(() => {
        // Generate fake health data
        const heartRate = Math.floor(60 + Math.random() * 60); // 60 - 120 bpm
        const temperature = (36.5 + Math.random() * 2).toFixed(1); // 36.5 - 38.5 C
        
        const payload = JSON.stringify({
            deviceId: 'device1',
            heartRate: heartRate,
            temperature: temperature,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📤 [HARDWARE] Sending vitals:`, payload);
        client.publish(TOPIC_DATA, payload);
    }, 5000);
});

// Listen for commands from Django
client.on('message', (topic, message) => {
    if (topic === TOPIC_COMMAND) {
        const command = JSON.parse(message.toString());
        console.log(`⚡ [HARDWARE] Received command from Backend:`, command);
        
        if (command.action === 'ALARM_ON') {
            console.log('🚨 [HARDWARE ACTION] Red LED is now ON (High Heart Rate!)');
        } else if (command.action === 'ALARM_OFF') {
            console.log('✅ [HARDWARE ACTION] Red LED is now OFF (Reset by Doctor)');
        }
    }
});