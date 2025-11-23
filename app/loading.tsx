import React from "react";

const loading = () => {
  return (
    <div>
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default loading;
