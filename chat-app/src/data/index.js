import { faker } from "@faker-js/faker";
import {
  ChatCircleDots,
  Gear,
  GearSix,
  Phone,
  SignOut,
  User,
  Users,
} from "phosphor-react";

const Profile_Menu = [
  {
    title: "Profile",
    icon: <User />,
  },
  {
    title: "Settings",
    icon: <Gear />,
  },
  {
    title: "Logout",
    icon: <SignOut />,
  },
];

const Nav_Buttons = [
  {
    index: 0,
    icon: <ChatCircleDots />,
  },
  {
    index: 1,
    icon: <Users />,
  },
  {
    index: 2,
    icon: <Phone />,
  },
];

const Nav_Setting = [
  {
    index: 3,
    icon: <GearSix />,
  },
];
const MembersList=[
  {
    id:0,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    online: false,
    
  },
  {
    id:1,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    online: true,
  },
  {
    id:2,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    online: true,
  },
  {
    id:3,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    online: false,
  },
  {
    id:4,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    online: false,
  },
  {
    id:5,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    online: true,
  },

];

const CallHistory=[
  {
    id:0,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    missed:false,
    incoming:true,
    online: true,
  },
  {
    id:1,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    missed:true,
    incoming:true,
    online: false,
  },
  {
    id:2,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    missed:false,
    incoming:false,
    online: false,
  },
  {
    id:3,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    missed:true,
    incoming:false,
    online: true,
  },
  {
    id:4,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    missed:false,
    incoming:true,
    online: true,
  },
  {
    id:5,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    missed:true,
    incoming:false,
    online: true,
  },
];

const ChatList = [
  {
    id: 0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "9:36",
    unread: 0,
    pinned: true,
    online: true,
  },
  {
    id: 1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "12:02",
    unread: 2,
    pinned: true,
    online: false,
  },
  {
    id: 2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "10:35",
    unread: 3,
    pinned: false,
    online: true,
  },
  {
    id: 3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "04:00",
    unread: 0,
    pinned: false,
    online: true,
  },
  {
    id: 4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 5,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 6,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 7,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
];

const Chat_History = [
  {
    type: "msg",
    message: "Hi 👋🏻, How are ya ?",
    incoming: true,
    outgoing: false,
  },
  {
    type: "divider",
    text: "Today",
  },
  {
    type: "msg",
    message: "Hi 👋 Panda, not bad, u ?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "msg",
    message: "Can you send me an abstarct image?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "msg",
    message: "Ya sure, sending you a pic",
    incoming: true,
    outgoing: false,
  },

  {
    type: "msg",
    subtype: "img",
    message: "Here You Go",
    img: faker.image.abstract(),
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    message: "Can you please send this in file format?",
    incoming: false,
    outgoing: true,
  },

  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "reply",
    reply: "This is a reply",
    message: "Yep, I can also do that",
    incoming: false,
    outgoing: true,
  },
];

const Message_options = [
  {
    title: "Reply",
  },
  {
    title: "React to message",
  },
  {
    title: "Forward message",
  },
  {
    title: "Star message",
  },
  {
    title: "Report",
  },
  {
    title: "Delete Message",
  },
];
const SHARED_LINKS=[
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  
  },
]
const SHARED_DOC=[
 { type: "msg",
  subtype: "doc",
  message: "Yes sure, here you go.",
  incoming: true,
  outgoing: false,
},
{ type: "msg",
subtype: "doc",
message: "Yes sure, here you go.",
incoming: true,
outgoing: false,
},
{ type: "msg",
subtype: "doc",
message: "Yes sure, here you go.",
incoming: true,
outgoing: false,
},

]

export {
  Profile_Menu,
  Nav_Setting,
  Nav_Buttons,
  ChatList,
  MembersList,
  CallHistory,
  Chat_History,
  Message_options,
  SHARED_LINKS,
  SHARED_DOC,
  
};
