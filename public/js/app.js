console.log('successfules loaded this js file')

var session = OT.initSession(serverData.apiKey, serverData.sessionId)
  .connect(serverData.token, function(error) {
    if (!error) {
      var publisher = OT.initPublisher('js-publish', {
        insertMode: 'append',
        width: '300px',
        height: '300px'
      });
      session.publish(publisher);
    } else {
      console.log('There was an error connecting to the session:', error.code, error.message);
    }
  })
  .on('streamCreated', function(event) {
    session.subscribe(event.stream, 'js-display');
    console.log('new stream created');
  });



