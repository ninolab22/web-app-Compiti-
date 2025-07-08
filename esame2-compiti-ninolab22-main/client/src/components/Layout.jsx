import Navbar from "./Navbar";

export default function Layout({ user, onLogout, children }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ padding: "0px" }}>
        {children}
      </main>
    </>
  );
}