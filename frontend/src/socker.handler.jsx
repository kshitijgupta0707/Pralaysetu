// // Connect to socket and listen for report update
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   query: {
//     userId: user._id,
//     userName: user.name,
//   },
//   withCredentials: true,
// });

// socket.on("reportStatusUpdate", ({ reportId, status, message }) => {
//   alert(message); // Or use toast
// });
