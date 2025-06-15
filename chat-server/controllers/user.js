const { json } = require("body-parser");
const User = require("../models/user");
const { filterObj } = require("../utils/filterObj");
const mongoose = require("mongoose");
const { generateToken04 } = require("./zegoServerAssistant");
const AudioCall = require("../models/audioCall");
const VideoCall = require("../models/videoCall");
const FriendRequest = require("../models/freindRequest");
const appID = process.env.ZEGO_APP_ID;
const serverSecret = process.env.ZEGO_SERVER_SECRET;

const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            status: "success",
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};

const updateMe = async (req, res, next) => {
    try {
        const { user } = req;
        const filteredBody = filterObj(req.body, "firstname", "lastname", "about", "avatar");

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            filteredBody,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: "success",
            data: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({ verified: true }).select("firstname lastname _id");
        const thisUser = req.user;

        const remainingUsers = allUsers.filter(
            user => !thisUser.friends.includes(user._id) && user._id.toString() !== thisUser._id.toString()
        );

        res.status(200).json({
            status: "success",
            data: remainingUsers,
            message: "Users found successfully"
        });
    } catch (error) {
        next(error);
    }
};

const getAllVerifiedUsers = async (req, res, next) => {
    try {
        const all_users = await User.find({ verified: true }).select("firstname lastname _id");
        const remaining_users = all_users.filter(
            (user) => user._id.toString() !== req.user._id.toString()
        );

        res.status(200).json({
            status: "success",
            data: remaining_users,
            message: "Users found successfully!",
        });
    } catch (error) {
        next(error);
    }
};

const getRequests = async (req, res, next) => {
    try {
        const recipientId = req.user._id;
        const requests = await FriendRequest.find({ recipient: recipientId })
            .populate("sender", "_id firstname lastname");

        res.status(200).json({
            status: "success",
            data: requests,
            message: "Requests found successfully"
        });
    } catch (error) {
        next(error);
    }
};

const getSenderRequests = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const requests = await FriendRequest.find({ sender: senderId })
            .populate("recipient", "_id firstname lastname");

        res.status(200).json({
            status: "success",
            data: requests,
            message: "Requests found successfully"
        });
    } catch (error) {
        next(error);
    }
};

const getFriends = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("friends", "_id firstname lastname");

        res.status(200).json({
            status: "success",
            data: user.friends,
            message: "Friends found successfully"
        });
    } catch (error) {
        next(error);
    }
};

const generateZegoToken = async (req, res, next) => {
    try {
        const { userId, room_id } = req.body;
        const effectiveTimeInSeconds = 3600; // Token expiration time in seconds
        const payloadObject = {
            room_id,
            // The token generated allows loginRoom (login room) action
            // The token generated in this example allows publishStream (push stream) action
            privilege: {
                1: 1, // loginRoom: 1 pass, 0 not pass
                2: 1, // publishStream: 1 pass, 0 not pass
            },
            stream_id_list: null,
        };
        const payload = JSON.stringify(payloadObject);
        const token = generateToken04(
            Number(appID),
            userId,
            serverSecret,
            effectiveTimeInSeconds,
            payload
        );

        res.status(200).json({
            status: "success",
            message: "Token generated successfully",
            token,
        });
    } catch (error) {
        next(error);
    }
};

const startAudioCall = async (req, res, next) => {
    try {
        const from = req.user;
        const to = req.body.id;

        const from_user = await User.findById(from);
        const to_user = await User.findById(to);

        // create a new call audioCall Doc and send required data to client
        const new_audio_call = await AudioCall.create({
            participants: [from, to],
            from,
            to,
            status: "Ongoing",
        });

        res.status(200).json({
            data: {
                from: to_user,
                roomID: new_audio_call._id,
                streamID: to_user,
                userID: from_user,
                userName: from_user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const startVideoCall = async (req, res, next) => {
    try {
        const from = req.user._id;
        const to = req.body.id;
        const from_user = await User.findById(from);
        const to_user = await User.findById(to);

        const new_video_call = await VideoCall.create({
            participants: [from, to],
            from,
            to,
            status: "Ongoing",
        });

        res.status(200).json({
            data: {
                from: from_user,
                roomID: new_video_call._id,
                streamID: from,
                userID: to_user._id,
                userName: to_user.firstname,
            },
        });
    } catch (error) {
        console.error("Error in startVideoCall:", error);
        next(error);
    }
};


const getCallLogs = (async (req, res, next) => {
    const user_id = req.user._id;

    const call_logs = [];

    const audio_calls = await AudioCall.find({
        participants: { $all: [user_id] },
    }).populate("from to");

    const video_calls = await VideoCall.find({
        participants: { $all: [user_id] },
    }).populate("from to");

    console.log(audio_calls, video_calls);

    for (let elm of audio_calls) {
        const missed = elm.verdict !== "Accepted";
        if (elm.from._id.toString() === user_id.toString()) {
            const other_user = elm.to;
            call_logs.push({
                id: elm._id,
                img: other_user.avatar,
                name: other_user.firstName,
                online: true,
                incoming: false,
                missed,
            })
        } else {
            // incoming
            const other_user = elm.from;

            // outgoing
            call_logs.push({
                id: elm._id,
                img: other_user.avatar,
                name: other_user.firstName,
                online: true,
                incoming: false,
                missed,
            });
        }
    }
})
module.exports = {
    updateMe,
    getUsers,
    getFriends,
    getRequests,
    getSenderRequests,
    getAllVerifiedUsers,
    getMe,
    generateZegoToken,
    startAudioCall,
    startVideoCall,
    getCallLogs
};
