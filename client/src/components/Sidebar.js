function Sidebar({ roomId, users }) {
  return (
    <div className="sidebar">
      <h3>Room</h3>
      <p>{roomId}</p>

      <button onClick={() => navigator.clipboard.writeText(roomId)}>
        Copy Room ID
      </button>

      <hr />

      <h3>Users</h3>
      {users.map((user) => (
        <div key={user.id}>🟢 {user.username}</div>
      ))}
    </div>
  );
}

export default Sidebar;