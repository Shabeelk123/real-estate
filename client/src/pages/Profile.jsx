import { useSelector } from "react-redux";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text=center text-3xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col self-center gap-4">
        <img
          src={currentUser.avatar}
          alt="profile pic"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2"
        ></img>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        ></input>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        ></input>
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        ></input>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase disabled:opacity-80 hover:opacity-95">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">SignOut</span>
      </div>
    </div>
  );
}
