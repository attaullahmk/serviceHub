import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { 
  FaUserEdit, 
  FaCamera, 
  FaStar, 
  FaBookmark, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaCheckCircle,
  FaTimes,
  FaPlus,
  FaTrash
} from "react-icons/fa";
import "./Profile.css";
import logo from "../../assets/image/logo.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Profile() {
    const { user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
      bio: "",
      location: "",
      contactNumber: "",
      experience: { years: 0, skills: [] },
      socialLinks: { 
        facebook: "", 
        twitter: "", 
        instagram: "", 
        linkedin: "" 
      }
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/userProfiles/${user._id}`);
                setProfile(response.data.profile);
                setFormData({
                  bio: response.data.profile.bio || "",
                  location: response.data.profile.location || "",
                  contactNumber: response.data.profile.contactNumber || "",
                  experience: {
                    years: response.data.profile.experience?.years || 0,
                    skills: response.data.profile.experience?.skills || []
                  },
                  socialLinks: {
                    facebook: response.data.profile.socialLinks?.facebook || "",
                    twitter: response.data.profile.socialLinks?.twitter || "",
                    instagram: response.data.profile.socialLinks?.instagram || "",
                    linkedin: response.data.profile.socialLinks?.linkedin || ""
                  }
                });
                setPreviewImage(response.data.profile.profilePicture || logo);
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                [name]: name === 'years' ? parseInt(value) : value
            }
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.experience.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                experience: {
                    ...prev.experience,
                    skills: [...prev.experience.skills, newSkill.trim()]
                }
            }));
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                skills: prev.experience.skills.filter(skill => skill !== skillToRemove)
            }
        }));
    };

    const handleSave = async () => {
        try {
            const form = new FormData();
            if (selectedFile) form.append("profilePicture", selectedFile);
            form.append("bio", formData.bio);
            form.append("location", formData.location);
            form.append("contactNumber", formData.contactNumber);
            form.append("experience[years]", formData.experience.years);
            formData.experience.skills.forEach((skill, index) => 
                form.append(`experience[skills][${index}]`, skill)
            );
            Object.entries(formData.socialLinks).forEach(([key, value]) => 
                form.append(`socialLinks[${key}]`, value)
            );

            const response = await axios.put(`${BASE_URL}/api/userProfiles/${user._id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile(response.data.profile);
            setEditing(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Profile update error:", err);
            setError("Failed to update profile");
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button 
                    className={`edit-toggle-btn ${editing ? 'cancel' : 'edit'}`}
                    onClick={() => setEditing(!editing)}
                >
                    {editing ? <><FaTimes /> Cancel</> : <><FaUserEdit /> Edit Profile</>}
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-image-container">
                        <img 
                            src={previewImage || logo} 
                            alt="Profile" 
                            className="profile-img" 
                        />
                        {editing && (
                            <label className="image-upload-btn">
                                <FaCamera />
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                />
                            </label>
                        )}
                    </div>
                    <h2>{user?.name}</h2>
                    <p className="location">{profile?.location || "Location not set"}</p>
                    
                    {!editing && profile?.experience?.years > 0 && (
                        <div className="experience-badge">
                            <FaStar /> {profile.experience.years}+ years experience
                        </div>
                    )}
                </div>

                <div className="profile-details">
                    {editing ? (
                        <>
                            <div className="form-section">
                                <h3>About Me</h3>
                                <textarea 
                                    name="bio" 
                                    value={formData.bio} 
                                    onChange={handleChange} 
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                />
                            </div>

                            <div className="form-section">
                                <h3>Contact Information</h3>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={handleChange} 
                                        placeholder="e.g. San Francisco, CA" 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="text" 
                                        name="contactNumber" 
                                        value={formData.contactNumber} 
                                        onChange={handleChange} 
                                        placeholder="+1234567890" 
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Experience</h3>
                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <input 
                                        type="number" 
                                        name="years" 
                                        value={formData.experience.years} 
                                        onChange={handleExperienceChange} 
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Skills</label>
                                    <div className="skills-input">
                                        <input 
                                            type="text" 
                                            value={newSkill} 
                                            onChange={(e) => setNewSkill(e.target.value)} 
                                            placeholder="Add a skill" 
                                        />
                                        <button onClick={addSkill}><FaPlus /></button>
                                    </div>
                                    <div className="skills-tags">
                                        {formData.experience.skills.map((skill, index) => (
                                            <span key={index} className="skill-tag">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)}>
                                                    <FaTrash />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Social Links</h3>
                                <div className="social-input-group">
                                    <FaFacebook className="social-icon" />
                                    <input 
                                        type="text" 
                                        name="facebook" 
                                        value={formData.socialLinks.facebook} 
                                        onChange={handleSocialLinkChange} 
                                        placeholder="Facebook profile URL" 
                                    />
                                </div>
                                <div className="social-input-group">
                                    <FaTwitter className="social-icon" />
                                    <input 
                                        type="text" 
                                        name="twitter" 
                                        value={formData.socialLinks.twitter} 
                                        onChange={handleSocialLinkChange} 
                                        placeholder="Twitter profile URL" 
                                    />
                                </div>
                                <div className="social-input-group">
                                    <FaInstagram className="social-icon" />
                                    <input 
                                        type="text" 
                                        name="instagram" 
                                        value={formData.socialLinks.instagram} 
                                        onChange={handleSocialLinkChange} 
                                        placeholder="Instagram profile URL" 
                                    />
                                </div>
                                <div className="social-input-group">
                                    <FaLinkedin className="social-icon" />
                                    <input 
                                        type="text" 
                                        name="linkedin" 
                                        value={formData.socialLinks.linkedin} 
                                        onChange={handleSocialLinkChange} 
                                        placeholder="LinkedIn profile URL" 
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button className="save-btn" onClick={handleSave}>
                                    <FaCheckCircle /> Save Changes
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="info-section">
                                <h3>About Me</h3>
                                <p className="bio">{profile?.bio || "No bio available"}</p>
                            </div>

                            <div className="info-section">
                                <h3>Contact Information</h3>
                                <div className="info-group">
                                    <strong>Phone:</strong>
                                    <span>{profile?.contactNumber || "Not provided"}</span>
                                </div>
                                <div className="info-group">
                                    <strong>Location:</strong>
                                    <span>{profile?.location || "Not provided"}</span>
                                </div>
                            </div>

                            {profile?.experience && (
                                <div className="info-section">
                                    <h3>Experience</h3>
                                    {profile.experience.years > 0 && (
                                        <div className="info-group">
                                            <strong>Years:</strong>
                                            <span>{profile.experience.years} years</span>
                                        </div>
                                    )}
                                    {profile.experience.skills?.length > 0 && (
                                        <div className="info-group">
                                            <strong>Skills:</strong>
                                            <div className="skills-container">
                                                {profile.experience.skills.map((skill, index) => (
                                                    <span key={index} className="skill-badge">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {profile?.socialLinks && (
                                <div className="info-section">
                                    <h3>Social Links</h3>
                                    <div className="social-links">
                                        {profile.socialLinks.facebook && (
                                            <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                                <FaFacebook />
                                            </a>
                                        )}
                                        {profile.socialLinks.twitter && (
                                            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                                <FaTwitter />
                                            </a>
                                        )}
                                        {profile.socialLinks.instagram && (
                                            <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                                <FaInstagram />
                                            </a>
                                        )}
                                        {profile.socialLinks.linkedin && (
                                            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                <FaLinkedin />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
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