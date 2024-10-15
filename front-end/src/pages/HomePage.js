import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomePageStyle.css"; // Import your CSS styles
import axios from 'axios';
import 'boxicons';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user  = JSON.parse(localStorage.getItem("userInfo"));

        if (user){
            navigate('/chats');
        }
    }, [navigate]);

    const [isLogin, setIsLogin] = useState(true);

    const handleSignupClick = () => {
        setIsLogin(false);
    };

    const handleSigninClick = () => {
        setIsLogin(true);
    };

    return (
        <div className={`container ${isLogin ? "sign-in-mode" : "sign-up-mode"}`}>
        <div className="forms-container">
            <div className="signin-signup">
            {isLogin ? <LoginForm /> : <SignupForm />}
            </div>
        </div>

        <div className="panels-container">
            <div className="panel left-panel">
            <div className="content">
                <h3>New here?</h3>
                <p>Click Sign up to make new account to connect with your friends</p>
                <button className="btn transparent" onClick={handleSignupClick}>
                Sign Up
                </button>
            </div>
            </div>

            <div className="panel right-panel">
            <div className="content">
                <h3>One of us?</h3>
                <p>If you have already joined Chat Hive then click here</p>
                <button className="btn transparent" onClick={handleSigninClick}>
                Sign In
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const LoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/user/login', { // Update to your login route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send data in JSON format
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("userInfo", JSON.stringify(data)); // added extra in lab
                navigate('/chats'); // Redirect to the chat page on successful login
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error.message); // Handle errors
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="sign-in-form" onSubmit={LoginSubmit}>
            <h1 className="title appname">Chat Hive</h1>
            <h2 className="title">Sign In</h2>
            <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-field password">
                <i className="fas fa-lock"></i>
                <input 
                    type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <box-icon
                    name={showPassword ? "hide" : "show"} // Boxicons eye icon
                    onClick={togglePasswordVisibility} // Toggle function
                    style={{ cursor: "pointer", marginLeft: "10px" }} // Cursor change for icon
                ></box-icon>
            </div>
            <input type="submit" value="Login" className="btn solid" />
        </form>
    );
}

function SignupForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const SignupSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            
            if (selectedImage) {
                formData.append("pic", selectedImage); // Append profile picture if it exists
            } else {
                alert("Please select an avatar");
                return;
            }

            const response = await fetch('http://localhost:5000/api/user', { // Change this to match your backend route
                method: 'POST',
                body: formData, // Send form data including the file
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("userInfo", JSON.stringify(data));
                alert("User registered"); // Show success message from backend
                setIsLogin(true); 
            } else {
                console.error("Error:", data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error.message); // Handle errors
        }
    };

    const generateImage = async () => {
        try {
            const response = await axios.get('https://avatar.iran.liara.run/public', { responseType: 'blob' });
            const imageUrl = URL.createObjectURL(response.data);
            setImage(imageUrl); // Update the state with the new image URL
        } catch (error) {
            console.error('Error fetching the image:', error);
        }
    };

    const selectImage = async () => {
        if (image) {
            const blob = await (await fetch(image)).blob(); // Convert image URL to Blob
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" }); // Create File object
            setSelectedImage(file); // Set the current image as selected
        }
    };   

    return (
        <form className="sign-up-form" onSubmit={SignupSubmit}>
            <h1 className="title appname">Chat Hive</h1>
            <h2 className="title">Sign Up</h2>
            <div className="image-field">
                <button className="randomimage" type="button" onClick={generateImage}>Generate Random Image</button>
        
                {image && (
                    <div className="image-container">
                        <img src={image} alt="Generated Avatar" />
                        <button className="select-image-btn" type="button" onClick={selectImage}>Select This Image</button>
                        {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
                    </div>
                )}

                {selectedImage && (
                    <div className="selected-image">
                        <h3>Selected Image:</h3>
                        <img src={URL.createObjectURL(selectedImage)} alt="Selected Avatar"/>
                    </div>
                )}
            </div>
            <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                />
            </div>
            <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                />
            </div>
            <div className="input-field password">
                <i className="fas fa-lock"></i>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <box-icon name={showPassword ? 'hide' : 'show'} type="solid" onClick={() => setShowPassword(!showPassword)}
                ></box-icon>
            </div>
            <div className="input-field password">
                <i className="fas fa-lock"></i>
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                />
                <box-icon name={showConfirmPassword ? 'hide' : 'show'} type="solid" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></box-icon>
            </div>
            <input type="submit" value="Sign Up" className="btn solid" />
        </form>
    );
}

export default HomePage;