import React from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Update({ user }) {
  const handleUpdate = () => {
    // <link rel="stylesheet" href="" />;
  };

  return (
    <>
      <div className="bg-slate-400 h-4  border-8">
        <Link to="/myclasses/:id">Zaktualizuj dane</Link>
      </div>
    </>
  );
}
