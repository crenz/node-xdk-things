const thingsAPIToken = '';

const thingsUserTenant = '';
const thingsUserName = '';
const thingsPassword = '';

const WebSocket = require('ws');
const ws = new WebSocket('wss://' + thingsUserTenant + '%5c' + thingsUserName + ': ' + thingsPassword + '@things.apps.bosch-iot-cloud.com/ws/1?x-cr-api-token=' + thingsAPIToken);

ws.on('open', function open() {
    console.log("[WS] Established");
    ws.send('START-SEND-EVENTS');
});

ws.on('message', function incoming(data) {
    if (data == 'START-SEND-EVENTS:ACK') {
        console.log("[WS] Acknowledged")
    } else {
    }
    
    try {
        obj = JSON.parse(data);
        // parse data from feature updates
        thingId = obj.topic.match('(.+)/things/twin/events/modified')[1];
        thingFeature = obj.path.match('/features/(.+)')[1];
        thingFeatureProperties = obj.value.properties;
        if (!thingId || !thingFeature) {
            return;
        }
    } catch (e) {
        return; // ignore non-JSON or non-feature messages
    }

    console.log('[Thing] ' + thingId +  ' - ' + thingFeature + ' > ');
    console.log(thingFeatureProperties);

    if (thingFeatureProperties.status.alert) {
        console.log("[Thing] RECEIVED ALERT");
    }


//    console.log(obj);
});