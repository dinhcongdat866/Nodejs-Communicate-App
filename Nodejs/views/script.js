const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

mediaConstraints = {
  video: true,
  audio: true
};

var enumeratorPromise = navigator.mediaDevices.enumerateDevices().then(function(devices) {
  var cam = devices.find(function(device) {
    return device.kind === "videoinput";
  });
    var mic = devices.find(function(device) {
      return device.kind === "audioinput";
    });
    var constraints = {video:cam && mediaConstraints.video, audio:mic && mediaConstraints.audio};
    console.log("getUserMedia start mediaConstraints=" + JSON.stringify(constraints));
    return navigator.mediaDevices.getUserMedia(constraints)
              .then(stream => {
                addVideoStream(myVideo, stream);
              
                myPeer.on('call', call => {
                  call.answer(stream)
                  const video = document.createElement('video')
                  call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                  })
                })
              
                socket.on('video-user-connected', userId => {
                  connectToNewUser(userId, stream)
                })
              }).catch(function(err) {
                console.log(err.name);
              });
            });
  
/*navigator.mediaDevices.getUserMedia({video:true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('video-user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})*/

socket.on('video-user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-video-chat', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}