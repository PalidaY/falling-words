const users = [];

// Join user to chat
function userJoin(id, username, room, score) {
  const user = { id, username, room, score };

  users.push(user);

  return user;
}


// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) { // Not found return -1
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function getUsersfromScore(score, room) {

  return users.filter(function (user) {
    return user.score == score && user.room == room;
  });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUsersfromScore,

};
