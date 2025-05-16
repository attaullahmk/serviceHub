import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaUserEdit, FaCamera, FaStar, FaBookmark, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCheckCircle } from "react-icons/fa";
import "./Profile.css";
import logo from "../../assets/image/logo.jpg";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Profile() {
    const { user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ bio: "", location: "", contactNumber: "", experience: { years: 0, skills: [] }, socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" } });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/userProfiles/${user._id}`);
                setProfile(response.data.profile);
                setFormData(response.data.profile);
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        if (user && user._id) fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleSave = async () => {
        try {
            const form = new FormData();
            if (selectedFile) form.append("profilePicture", selectedFile);
            form.append("bio", formData.bio);
            form.append("location", formData.location);
            form.append("contactNumber", formData.contactNumber);
            form.append("experience[years]", formData.experience.years);
            formData.experience.skills.forEach((skill, index) => form.append(`experience[skills][${index}]`, skill));
            Object.entries(formData.socialLinks).forEach(([key, value]) => form.append(`socialLinks[${key}]`, value));

            const response = await axios.put(`${BASE_URL}/api/userProfiles/${user._id}`, form);
            setProfile(response.data.profile);
            setEditing(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Profile update error:", err);
            setError("Failed to update profile");
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;
console.log("Profile data:", profile);
    return (
        <div className="profile-container">
            <div className="profile-card">
                <img src={profile?.profilePicture || logo } alt="Profile" className="profile-img" />
                {editing && (
                    <div className="file-input-container">
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>
                )}
                <h2>{user?.name}</h2>
                <p>{profile?.location || "Location not set"}</p>
                <button className="edit-btn" onClick={() => setEditing(!editing)}><FaUserEdit /> {editing ? "Cancel" : "Edit Profile"}</button>
            </div>

            {editing ? (
                <div className="profile-edit">
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Write something about yourself..." />
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                    <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" />
                    <button className="save-btn" onClick={handleSave}><FaCheckCircle /> Save Changes</button>
                </div>
            ) : (
                <div className="profile-details">
                    <h3>About Me</h3>
                    <p>{profile?.bio || "No bio available"}</p>
                    <p><strong>Contact:</strong> {profile?.contactNumber || "Not provided"}</p>
                    <p><strong>Location:</strong> {profile?.location || "Not provided"}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;






























// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { FaUserEdit, FaCamera, FaStar, FaBookmark, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
// import "./Profile.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// function Profile() {
//     const { user } = useSelector((state) => state.auth);
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await axios.get(`${BASE_URL}/api/userProfiles/${user._id}`);
//                 setProfile(response.data.profile);
//                 console.log("Profile data:", response.data.profile);
//             } catch (err) {
//                 setError("Failed to load profile");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (user && user._id) {
//             fetchProfile();
//         }
//     }, [user]);

//     if (loading) return <div className="profile-loading">Loading...</div>;
//     if (error) return <div className="profile-error">{error}</div>;

//     return (
//         <div className="profile-container">
//             <div className="profile-card">
//                 <img 
//                     src={profile?.profilePicture || "/assets/profile-placeholder.png"} 
//                     alt="Profile" 
//                     className="profile-img" 
//                 />
//                 <h2>{user?.name}</h2>
//                 <p>{profile?.location || "Location not set"}</p>
//                 <button className="edit-btn"><FaUserEdit /> Edit Profile</button>
//             </div>

//             <div className="profile-details">
//                 <h3>About Me</h3>
//                 <p className="bio">{profile?.bio || "No bio available"}</p>
//                 <div className="contact-info">
//                     <p><strong>Contact:</strong> {profile?.contactNumber || "Not provided"}</p>
//                     <p><strong>Location:</strong> {profile?.location || "Not provided"}</p>
//                 </div>
//                 <div className="experience">
//                     <h4>Experience</h4>
//                     <p>{profile?.experience?.years} years</p>
//                     <ul>
//                         {profile?.experience?.skills?.length ? (
//                             profile.experience.skills.map((skill, index) => (
//                                 <li key={index}>{skill}</li>
//                             ))
//                         ) : (
//                             <li>No skills listed</li>
//                         )}
//                     </ul>
//                 </div>
//                 <div className="social-links">
//                     <h4>Social Links</h4>
//                     <ul>
//                         {profile?.socialLinks?.facebook && <li><FaFacebook /> <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
//                         {profile?.socialLinks?.twitter && <li><FaTwitter /> <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></li>}
//                         {profile?.socialLinks?.instagram && <li><FaInstagram /> <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
//                         {profile?.socialLinks?.linkedin && <li><FaLinkedin /> <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;






































// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { FaUserEdit, FaCamera, FaHome, FaStar, FaBookmark, FaCalendarAlt } from "react-icons/fa";
// import "./Profile.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// function Profile() {
//     const { user } = useSelector((state) => state.auth);
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await axios.get(`${BASE_URL}/api/userProfiles/${user._id}`);
//                 setProfile(response.data.profile);
//                 console.log("Profile data:", response.data.profile);
                
//             } catch (err) {
//                 setError("Failed to load profile");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (user && user._id) {
//             fetchProfile();
//         }
//     }, [user]);

//     // if (loading) {
//     //     return <div className="profile-loading">Loading...</div>;
//     // }

//     if (error) {
//         return <div className="profile-error">{error}</div>;
//     }

//     console.log("Profile data:", profile);
//     console.log("User data:", user._id);
//     return (
//         <div className="profile-container">
//             <div className="profile-sidebar">
//                 <div className="profile-card">
//                     <img 
//                         src={profile?.profilePicture || "/assets/profile-placeholder.png"} 
//                         alt="Profile" 
//                         className="profile-img" 
//                     />
//                     <h2>{user?.name}</h2>
//                     <p>{profile?.location || "Location not set"}</p>
//                     <div className="profile-actions">
//                         <button><FaUserEdit /> Edit Profile</button>
//                         <button><FaCamera /> Add Photo</button>
//                     </div>
//                 </div>
//                 <ul className="profile-menu">
//                     <li><FaHome /> Profile Overview</li>
//                     <li><FaStar /> Reviews</li>
//                     <li><FaBookmark /> Favorites</li>
//                     <li><FaCalendarAlt /> Events</li>
//                 </ul>
//             </div>

//             <div className="profile-content">
//                 <h3>About Me</h3>
//                 <div className="more-about">
//                     <div className="more-item">
//                         <strong>Bio</strong>
//                         <p>{profile?.bio || "No bio available"}</p>
//                     </div>
//                     <div className="more-item">
//                         <strong>Phone</strong>
//                         <p>{profile?.phone || "Not provided"}</p>
//                     </div>
//                     <div className="more-item">
//                         <strong>Website</strong>
//                         <p>
//                             {profile?.website ? (
//                                 <a href={profile.website} target="_blank" rel="noopener noreferrer">
//                                     {profile.website}
//                                 </a>
//                             ) : (
//                                 "Not provided"
//                             )}
//                         </p>
//                     </div>
//                     <div className="more-item">
//                         <strong>Location</strong>
//                         <p>{profile?.location || "Not provided"}</p>
//                     </div>
//                     <div className="more-item">
//                         <strong>Favorites</strong>
//                         <ul>
//                             {profile?.favorites?.length ? (
//                                 profile.favorites.map((serviceId) => (
//                                     <li key={serviceId}>{serviceId}</li>
//                                 ))
//                             ) : (
//                                 <li>No favorite services yet</li>
//                             )}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;























































// import React from 'react';
// import './Profile.css';
// import { FaUserEdit, FaUserFriends, FaCamera, FaHome, FaStar, FaBookmark, FaCalendarAlt } from 'react-icons/fa';

// function Profile() {
//     return (
//         <div className="profile-container">
//             <div className="profile-sidebar">
//                 <div className="profile-card">
//                     <img src="/assets/profile-placeholder.png" alt="Profile" className="profile-img" />
//                     <h2>Atta U.</h2>
//                     <p>San Francisco, CA</p>
//                     <div className="profile-actions">
//                         <button><FaUserEdit /> Edit profile</button>
//                         <button><FaCamera /> Add photo</button>
//                         <button><FaUserFriends /> Add friends</button>
//                     </div>
//                 </div>
//                 <ul className="profile-menu">
//                     <li><FaHome /> Profile overview</li>
//                     <li><FaStar /> Reviews</li>
//                     <li><FaBookmark /> Collections</li>
//                     <li><FaCalendarAlt /> Events</li>
//                 </ul>
//             </div>

//             <div className="profile-content">
//                 <h3>More about me</h3>
//                 <div className="more-about">
//                     <div className="more-item">
//                         <strong>Location</strong>
//                         <p>San Francisco, CA</p>
//                     </div>
//                     <div className="more-item">
//                         <strong>Yelping since</strong>
//                         <p>February 2025</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;