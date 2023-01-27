import Navbar from "../Navbar";

export default function MyPage() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col ">
        <div className="w-6/12 mx-auto ">
          <h1>My profile</h1>
          <h2>My Classes</h2>
          <h2>My Account</h2>
          <div className="data">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            necessitatibus ipsam nihil cumque quidem? Enim nobis ipsa nihil
            cumque iure esse doloremque possimus alias laboriosam, sint delectus
            quis nesciunt numquam!
          </div>
          <form className="px-4  flex  flex-col p-4  items-center border-8    h-auto">
            <div className="flex  flex-col p-4    justify-around  justify-items-start h-48  w-6/12  ">
              <div className="flex justify-between space-x-2">
                <label htmlFor="name">Name</label>
                <input
                  className="  bg-slate-200  rounded-sm"
                  type="text"
                  name="name"
                  id="name"
                />
              </div>
              <div className="flex justify-between space-x-2">
                <label htmlFor="password">Password</label>
                <input
                  className="  bg-slate-200  rounded-sm"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </div>
            <button className=" bg-zinc-600 self-center" type="submit">
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
