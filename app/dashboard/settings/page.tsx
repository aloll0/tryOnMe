import Settings from "../../components/settings/page"
import Sidebar from "../../components/Sidebar"

const page = () => {
  return (
    <div className="flex items-center justify-center">
      <Sidebar />
      <Settings />
    </div>
  )
}

export default page