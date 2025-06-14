import { WebSocket, WebSocketServer } from "ws";


interface Iuser {
    socket: WebSocket;
    roomid: string;

}

const allSocket: Iuser[] = [];

const wss = new WebSocketServer({ port: 8080 })
console.log("user typescipt file is running")
let userCount = 0;
wss.on("connection", (socket) => {

    // allSocket.push(socket)
    userCount = userCount + 1;
    console.log(`Total user connected ${userCount}`)


    socket.on("message", (message) => {

        // @ts-ignore
        const parseMessage = JSON.parse(message);



        if (parseMessage.type == "join") {
            allSocket.push({
                socket,
                roomid: parseMessage.payload.roomid

            })
        } else if (parseMessage.type == "chat") {
            const currentUser = allSocket.find((s) => s.socket == socket);
            if (!currentUser) {
                socket.send("You must join before join")
                return;
            }

            const roomid = currentUser.roomid;

            allSocket.forEach((u) => {
                if (u.roomid == roomid && u.socket.readyState == WebSocket.OPEN) {
                    u.socket.send(`${parseMessage.payload.message}`)
                }
            })

        }


        // allSocket.forEach((s) => {
        //     if (s.readyState == WebSocket.OPEN) {
        //         s.send(`${msg} from the server`)
        //     }
        // })




    })

})