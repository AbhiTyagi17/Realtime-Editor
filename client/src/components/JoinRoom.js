function JoinRoom({ username, setUsername, roomId, setRoomId, joinRoom }) {
  return (
    <div className="join-container">
      <h2>Join Room</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <br /><br />

      <button onClick={joinRoom} disabled={!roomId || !username}>
        Join
      </button>
    </div>
  );
}

export default JoinRoom;