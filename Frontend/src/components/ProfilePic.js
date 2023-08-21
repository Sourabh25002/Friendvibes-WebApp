import React, { useState, useEffect, useRef } from "react";
// import { useHistory } from "react-router-dom";
export default function ProfilePic({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  // const history = useHistory();
  // posting image to cloudinary
  const postDetails = () => {
    console.log("postDetails called");
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "OnlineSiteClone")
    data.append("cloud_name", "developweb")
    console.log("FormData:", data);
    fetch("https://api.cloudinary.com/v1_1/developweb/image/upload", {
      method: "post",
      body: data,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) =>
      {   console.log("Cloudinary Response:", data);
         setUrl(data.url)
      })
      .catch((error) => {
        console.error("Cloudinary upload error:", error);
      })
    //   .then((res) => res.json())
    //   .then((data) => setUrl(data.url))
    //   .catch((err) => console.log(err));
    // console.log(url);
  };

  const postPic = () => {
    console.log("postPic called");
    // saving post to mongodb
    fetch("/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        changeprofile();
          window.location.reload();
        // history.push("/profile"); // Redirect to profile page
      })
      .catch((err) => console.log(err));
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image]);
  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url]);
  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" onClick={()=>{
            setUrl(null)
            postPic()
          }} style={{ color: "#ED4956" }}>
            {" "}
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeprofile}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}