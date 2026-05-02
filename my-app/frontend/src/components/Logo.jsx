"use client";
const Logo = (props) => {
  return (
    <img
      className="logoimageBox"
      src="/images/next.svg"
      alt="Logo"
      {...props}
      style={{ width: "auto", maxWidth: "190px" }}
    />
  );
};

export default Logo;
