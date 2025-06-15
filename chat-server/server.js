const app = require("./app");
const http = require("http");
const detenv = require("dotenv");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const User = require("./models/user");
const FriendRequest = require("./models/freindRequest");
const path = require('path');
const oneToOneMessage = require("./models/OnetoOneMessage");
const AudioCall = require("./models/audioCall");
const server = http.createServer(app);
const PORT = process.env.PORT || 3500;

process.on("uncaughtException", (err) => {
    console.log(err);
    process.exit(1);
});

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3500", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

const DB = process.env.DBURI.replace("<PASSWORD>", process.env.DBPASSWORD)

mongoose.connect(DB, {
}).then((con) => {
    console.log("DB connection is sucessful")
}).catch((err) => {
    console.log(err);
});

server.listen(PORT, () => {
    console.log(`App is running on ${PORT} `)
});

io.on("connection", async (socket) => {
    console.log(JSON.stringify(socket.handshake.query));
    console.log(socket);
    const user_id = socket.handshake.query["user_id"];

    const socket_id = socket.id;

    console.log(`User connected ${socket_id}`)

    if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
        await User.findByIdAndUpdate(user_id, { socket_id, status: "Online" });
    } else {
        console.error("Invalid user ID:", user_id);
    }
    socket.on("friend_request", async (data) => {
        try {
            if (!data || !data.to || !data.from) {
                return console.error("Invalid data received for friend_request:", data);
            }
            console.log("Friend request data:", data);

            const [to_user, from_user] = await Promise.all([
                User.findById(data.to).select("socket_id"),
                User.findById(data.from).select("socket_id"),
            ]);

            if (!to_user || !from_user) {
                return console.error("Recipient or sender not found:", { to_user, from_user });
            }
            console.log("Recipient socket ID:", to_user.socket_id);
            console.log("Sender socket ID:", from_user.socket_id);

            await FriendRequest.create({
                sender: data.from,
                recipient: data.to,
            });
            if (to_user) {
                console.log("Recipient socket ID:", to_user.socket_id);
                io.to(to_user.socket_id).emit("new_friend_request", {
                    message: "New Friend Request Received",
                });
            } else {
                console.log("Recipient is offline, request stored in the database.");
            }
            io.to(from_user.socket_id).emit("request_sent", {
                message: "Request sent successfully!",
            });
            console.log("Friend request sent successfully from", data.from, "to", data.to);
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    });


    socket.on("accept_request", async (data) => {
        try {
            // Validate input data
            if (!data || !data.request_id) {
                return console.error("Invalid data received for accept_request:", data);
            }
            console.log("Received data:", data);
            const request_doc = await FriendRequest.findById(data.request_id);
            if (!request_doc) {
                return console.error("Friend request not found:", data.request_id);
            }
            console.log("Friend request document:", request_doc);
            // Find the sender and receiver user documents
            const [sender, receiver] = await Promise.all([
                User.findById(request_doc.sender),
                User.findById(request_doc.recipient)
            ]);

            if (!sender || !receiver) {
                return console.error("Sender or receiver not found:", { sender, receiver });
            }
            console.log("Sender:", sender);
            console.log("Receiver:", receiver);
            // Add each other to their friends list
            sender.friends.push(receiver._id);
            receiver.friends.push(sender._id);

            // Delete the friend request document
            await FriendRequest.findByIdAndDelete(data.request_id);

            // Save the updated user documents
            await Promise.all([
                sender.save({ new: true, validateModifiedOnly: true }),
                receiver.save({ new: true, validateModifiedOnly: true })
            ]);

            // Emit success messages to both users
            const successMessage = { message: "Friend Request Accepted" };
            io.to(sender.socket_id).emit("request_accepted", successMessage);
            io.to(receiver.socket_id).emit("request_accepted", successMessage);

            console.log("Friend request accepted successfully for request ID:", data.request_id);

        } catch (error) {
            console.error("Error processing friend request acceptance:", error);
        }
    });

    // socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    //     try {
    //         // Ensure the user_id is a valid ObjectId
    //         if (!ObjectId.isValid(user_id)) {
    //             return callback([]);
    //         }

    //         // Fetch the existing conversations
    //         const existing_conversations = await oneToOneMessage.find({
    //             participants: { $all: [ObjectId(user_id)] },
    //         }).populate("participants", "firstname lastname _id email status");

    //         console.log(existing_conversations);
    //         callback(existing_conversations);
    //     } catch (error) {
    //         console.error("Error fetching direct conversations:", error);
    //         callback([]);
    //     }
    // });

    socket.on("start_conversation", async (data) => {
        try {
            if (!data || !data.to || !data.from) {
                return console.error("Invalid data received for start_conversation:", data);
            }
            const { to, from } = data;
            // Check if there is any existing conversation between these users
            const existing_conversation = await oneToOneMessage.find({
                participants: { $size: 2, $all: [to, from] }
            }).populate("participants", "firstname lastname _id email status");

            console.log(existing_conversation[0], "Existing Convo");
            if (existing_conversation.length === 0) {
                let new_chat = await oneToOneMessage.create({ participants: [to, from] });
                new_chat = await oneToOneMessage.findById(new_chat._id).populate("participants", "firstname lastname _id email status");
                console.log(new_chat);
                socket.emit("start_chat", new_chat);
            } else {
                socket.emit("start_chat", existing_conversation[0]);
            }
        } catch (error) {
            console.error("Error fetching direct conversations:", error);
        }
    });
    socket.on("get_message", async (data, callback) => {
        try {
            const conversation = await oneToOneMessage.findById(data.conversation_id).select("messages");
            if (conversation && conversation.messages) {
                callback(conversation.messages);
            } else {
                callback([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            callback([]);
        }
    });
    //Handle Text and Link message
    socket.on("text_message", async (data) => {
        try {
            const { to, from, message, conversation_id, type } = data;
            const to_user = await User.findById(to);
            const from_user = await User.findById(from);

            const new_message = {
                to,
                from,
                type,
                text: message,
                created_at: Date.now()
            };

            const chat = await oneToOneMessage.findById(conversation_id);
            chat.messages.push(new_message);
            await chat.save();

            io.to(to_user.socket_id).emit("new_message", { conversation_id, message: new_message });
            io.to(from_user.socket_id).emit("new_message", { conversation_id, message: new_message });
        } catch (error) {
            console.error("Error sending text message:", error);
        }
    });


    //Handle File message
    socket.on("file_message", (data) => {
        console.log("Recived Message", data);
        //data:{to,from,text}

        //get the file extension
        const fileExtension = path.extname(data.file.name);

        //generate a unique filename
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}${fileExtension}`;

        //upload file to AWS s3

        //create a new conversation if dosen't exist yet or add new message to the message list

        //save to db

        //emit incoming_message->to user

        //emit outgoing_message ->from user

    })
    //handle start_audio_call event
    socket.on("start_audio_call", async (data) => {
        try {
            const { from, to, roomID } = data;
            const [to_user, from_user] = await Promise.all([
                User.findById(to),
                User.findById(from)
            ]);

            if (to_user) {
                io.to(to_user.socket_id).emit("audio_call_notification", {
                    from: from_user,
                    roomID,
                    streamID: from_user,
                    userID: to_user,
                    userName: to_user.firstname,
                });
            }
        } catch (error) {
            console.error("Error starting audio call:", error);
        }
    });
    // handle audio_call_not_picked
    socket.on("audio_call_not_picked", async (data) => {
        try {
            const { to, from } = data;
            const to_user = await User.findById(to);
            await AudioCall.findOneAndUpdate(
                { participants: { $size: 2, $all: [toString, from] } },
                { verdict: "Missed", status: "Ended", endedAt: Date.now() }
            );
            io.to(to_user.socket_id).emit("audio_call_missed", { from, to });            
        } catch (error) {
            console.error("Error handling audio call not picked:", error);
        }
    });

    socket.on("audio_call_accepted", async (data) => {
        try {
            const { userID, from } = data;
            const from_user = await User.findById(from);
            await AudioCall.findOneAndUpdate(
                { participants: { $size: 2, $all: [userID, from] } },
                { verdict: "Accepted" }
            );
            // TODO => emit call_accepted to sender of call
            io.to(from_user.socket_id).emit("audio_call_accepted", { from, to:userID});
        } catch (error) {
            console.error("Error handling audio call acceptance:", error);
        }
    });

    socket.on("audio_call_denied", async (data) => {
        try {
            const { userID, from } = data; 
            // console.log("audio_call_denied event received:", data);
    
            const updatedCall = await AudioCall.findOneAndUpdate(
                { participants: { $size: 2, $all: [userID, from] } }, 
                { verdict: "Denied", status: "Ended", endAt: Date.now() }, 
                { new: true }
            );
            // console.log("Call record updated:", updatedCall);
    
            const from_user = await User.findById(from);
            io.to(from_user?.socket_id).emit("audio_call_denied", { from, to: userID }); 
        } catch (error) {
            console.error("Error handling audio call denial:", error);
        }
    });
    
    // handle user_is_busy_video_call
    socket.on("user_is_busy_video_call", async (data) => {
        try {
            const { userID, from } = data;
            // find and update call record
            await VideoCall.findOneAndUpdate({ participants: { $size: 2, $all: [userID, from] } },
                { verdict: "Busy", status: "Ended", endedAt: Date.now() }
            );
            const from_user = await User.findById(from);
            // TODO => emit on_another_video_call to sender of call
            io.to(from_user?.socket_id).emit("on_another_video_call", { from, to:userID });
        } catch (error) {
            console.error("Error handling audio call acceptance:", error);
        }
    });    

    socket.on("end", async (data) => {
        try {
            // Validate user_id
            if (data.user_id && ObjectId.isValid(data.user_id)) {
                await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
            } else {
                console.error("Invalid user ID for end event:", data.user_id);
            }
        } catch (error) {
            console.error("Error setting user offline:", error);
        }

        console.log("Closing connection");
        socket.disconnect(0);
    });
});


process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
