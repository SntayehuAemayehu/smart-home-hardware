const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

const TOPIC_DATA = 'water_project/device1/sensor';
const TOPIC_COMMAND = 'water_project/device1/command';

client.on('connect', () => {
    console.log('🟢 [WATER SENSOR] Connected to MQTT Broker');
    client.subscribe(TOPIC_COMMAND, (err) => {
        if (!err) console.log(`📡 Listening for commands on: ${TOPIC_COMMAND}`);
    });

    setInterval(() => {
        // Simulate water quality readings: mostly normal, occasionally abnormal
        const turbidity = (Math.random() * 8).toFixed(1); // 0–8 NTU, >5 is abnormal
        const ph = (6.0 + Math.random() * 3).toFixed(1);  // 6.0–9.0, outside 6.5–8.5 is abnormal
        
        const payload = JSON.stringify({
            deviceId: 'water_point_01',
            turbidity: parseFloat(turbidity),
            ph: parseFloat(ph),
            timestamp: new Date().toISOString()
        });
        
        console.log(`📤 Sending:`, payload);
        client.publish(TOPIC_DATA, payload);
    }, 5000);
});

client.on('message', (topic, message) => {
    if (topic === TOPIC_COMMAND) {
        const command = JSON.parse(message.toString());
        console.log(`⚡ Received command:`, command);
        if (command.action === 'DISPATCH_MAINTENANCE') {
            console.log('🔧 [HARDWARE] Maintenance acknowledged. Field team notified.');
        }
    }
});