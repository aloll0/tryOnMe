// import ProductCard from "./components/ProductCard/ProductCard";
import Login from "./dashboard/(auth)/login/Login"
import Register from "./dashboard/(auth)/register/Register"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <Login />
      <Register />
      {/* <ProductCard /> */}
    </main>
  );
}
