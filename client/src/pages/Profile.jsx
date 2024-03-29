import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { app } from "../firebase";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  console.log(currentUser);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //getting upload percentage
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      //it will add uploaded image url to formdata
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  console.log(list);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        signOutUserFailure(data.message);
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      signOutUserFailure(error.message);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const list = await res.json();
      if (list.success === false) {
        setShowListingError(true);
        return;
      }
      setList(list);
    } catch (error) {
      window.console.log(error);
      setShowListingError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text=center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile pic"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center"
          onClick={() => fileRef.current.click()}
        ></img>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error in image upload (image size should be less than 2mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">
              {" "}
              {`Uploading ${filePercent}%`}
            </span>
          ) : filePercent === 100 && !fileUploadError ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleInputChange}
        ></input>
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
          id="email"
        ></input>
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleInputChange}
          id="password"
        ></input>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase disabled:opacity-80 hover:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          SignOut
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button className="text-green-700 w-full" onClick={handleShowListings}>
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error showing on Listings!!" : ""}
      </p>
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
      {list &&
        list.length > 0 &&
        list.map((items) => {
          return (<div key={items._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link to={`/listing/${items._id}`}>
              <img
                src={items.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              ></img>
            </Link>
            <Link className="flex-1 text-slate-700 font-semibold hove:underline truncate" to={`/listing/${items._id}`}>
              <p>{items.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button className="text-red-700 uppercase">Delete</button>
              <button className="text-green-700 uppercase">Edit</button>
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}
