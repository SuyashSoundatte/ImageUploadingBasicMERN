import { TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./components/UserCard";

function App() {
  const [data, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    bio: "",
    FY: "",
    SY: "",
    TY: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const fetchURL = "http://localhost:3000/data";
        const response = await axios.get(fetchURL);
        console.log(response);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      console.log("Selected file:", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.age || !formData.bio || !image) {
        console.error("Please fill all fields and select an image.");
        alert("Please fill all fields and select an image.");
        return;
    }

    const age = parseInt(formData.age);
    if (age < 18) {
        console.error("Age must be at least 18.");
        alert("Age must be at least 18.");
        return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("age", age);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("FY", formData.FY);
    formDataToSend.append("SY", formData.SY);
    formDataToSend.append("TY", formData.TY);
    
    formDataToSend.append("imageUrl", image);

    try {
        const postURL = "http://localhost:3000/data";
        const response = await axios.post(postURL, formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Response received:", response.data);
        setUserData(prevData => [...prevData, response.data.show]); 
        setFormData({ name: "", email: "", age: "", bio: "", FY: "", SY: "", TY: "" }); 
        setImage(null); // Reset image
    } catch (error) {
        console.error("Error posting data:", error.response ? error.response.data : error.message); // Log detailed error
    }
};


  return (
    <div
      style={{
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.name}
          label="Name"
          name="name"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.email}
          label="Email"
          name="email"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.age}
          label="Age"
          name="age"
          type="number"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.bio}
          label="Bio"
          name="bio"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.FY}
          label="FY"
          name="FY"
          type="number"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.SY}
          label="SY"
          name="SY"
          type="number"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          onChange={handleInputChange}
          value={formData.TY}
          label="TY"
          name="TY"
          type="number"
          variant="filled"
        />
        <input
          type="file"
          name="imageUrl"
          id="imageUrl"
          onChange={handleImageChange}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
      {data.map((item, index) => (
        <UserCard
          key={index}
          name={item.name}
          email={item.email}
          age={item.age}
          img={item.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
