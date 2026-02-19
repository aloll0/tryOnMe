import Uploads from "../../components/uploads/page";
import Sidebar from "../../components/Sidebar";

const page = () => {
  return (
    <div className="flex items-center justify-center">
      <Sidebar />
      <Uploads />
    </div>
  );
};

export default page;
