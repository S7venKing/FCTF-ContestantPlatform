import React from "react";

const CornerBorderBox = ({ children }) => {
  return (
    <div
      className="w-full bg-[rgba(0,0,0,0.80)] h-auto rounded h-[88px] relative shadow-md mt-3 p-3  flex flex-wrap justify-center border-2 border-secondary max-w-7xl mx-auto"
      style={{ flex: 1 }}
    >
      <div className="border-solid border-main-tan-ui border absolute right-[3px] left-[3px] bottom-[3px] top-[3px]">
        <div className="absolute top-0 left-0 w-4 h-4 bg-[#d1cbb1] [clip-path:polygon(0_0,100%_0,0_100%)]"></div>

        <div className="absolute top-0 right-0 w-4 h-4 bg-[#d1cbb1] [clip-path:polygon(100%_0,100%_100%,0_0)]"></div>

        <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#d1cbb1] [clip-path:polygon(0_100%,0_0,100%_100%)]"></div>

        <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#d1cbb1] [clip-path:polygon(100%_100%,100%_0,0_100%)]"></div>
      </div>

      {/* Nội dung */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CornerBorderBox;
