import { PuffLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <PuffLoader color="#00abe4" size={70} speedMultiplier={1.5} />
    </div>
  );
};

export default Loading;
