'use strict'

module.exports = list => {
  // Destroy all sockets before closing the server
  // Otherwise it will gracefully exit and take a long time
  for (const socket of list) socket.destroy()
}
