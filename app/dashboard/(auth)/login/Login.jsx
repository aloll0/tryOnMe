"use client";

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted");
}

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-black">Login</h2>
        <div className="form-container">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="Email" placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded text-black" />
            <input type="password" placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded text-black" />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
 
export default Login