export const buttonStyle: React.CSSProperties = {
  width: "20px",
  height: "80px",
  borderRadius: "3rem",
  background: "#ff9203ff",
  color: "#fff",
  border: "none",
  outline: "none",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  zIndex: 9999
};

export function DownloadBtn() {
  return <button style={buttonStyle}>Download Video</button>;
}
