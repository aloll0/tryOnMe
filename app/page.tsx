// import ProductCard from "./components/ProductCard/ProductCard";
// import Login from "./dashboard/(auth)/login/page"
// import Register from "./dashboard/(auth)/register/page"
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/login");
  return (
    <main className="min-h-screen flex items-center bg-white w-full">
      {/* <ProductCard /> */}
      {/* <Register /> */}
    </main>
  );
}
