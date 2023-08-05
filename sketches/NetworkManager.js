const net = require('net');
const END_OF_PACKET = "|"
const END_OF_SEGMENT = ";"

class NetworkManager {
    constructor(host, port) {
        this.client = net.connect({port: port, host:host});
        this.client.on("data", this.readAndProcess)
        this.client.buffer = ""
        this.client.currentChar = ""
        this.client.currentMessage = ""
        this.client.received_packets = []

        this.output = {name: null, players: [], error:false}


        window.onbeforeunload = () => {
            this.destroy()
        }
    }

    processPacket(packet) {
        switch(packet[0]) {
            case "0":
                this.output.error = true
                console.log("ERROR: ", packet[1])
                break;
            case "1":
                console.log("LOGIN SUCESSFULL!")
                this.output.name = packet[1]
                break;
            case "2":
                this.output.players = []
                for (var i = 1; i < packet.length; i+=4) {
                    if (i+3 < packet.length) {
                        var name = packet[i]
                        var x = packet[i+1]
                        var y = packet[i+2]
                        var vx = packet[i+3]
                        if (name != this.output.name) {
                            this.output.players[name] = {x:x, y:y, vx:vx, name:name}
                        }
                    }
                }
                break;
        }
    }

    sendPacket(type, data) {
        var output = type + ""
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                output += END_OF_SEGMENT
                output += data[i]
            }
            output += END_OF_PACKET
        } else {
            output += END_OF_SEGMENT + data + END_OF_PACKET
        }
        this.client.write(output)
    }

    update() {
        var packet;
        while(this.client.received_packets.length > 0) {
            packet = this.client.received_packets.pop();
            this.processPacket(packet)
        }
    }

    login(name) {
        this.client.write("0;" + name + "|")
    }

    readAndProcess(data) {
        if (data) {
            this.buffer += data.toString()
            while(this.buffer.length > 0) {
                this.currentChar = this.buffer[0]
                this.buffer = this.buffer.substring(1)
                if (this.currentChar == END_OF_PACKET) {
                    var segments = this.currentMessage.split(END_OF_SEGMENT);
                    this.received_packets.push(segments)
                    this.currentMessage = ""
                } else {
                    this.currentMessage += this.currentChar
                }
            }
        }
        
    }

    destroy() {
        this.client.destroy();
    }
}
