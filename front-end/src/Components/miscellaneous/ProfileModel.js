import React from "react";
import "./ProfileModel.css"

const ProfileModel = ({ user, children }) => {
    const openModal = () => {
        document.getElementById("profileModal").style.display = "block";
    };

    const closeModal = () => {
        document.getElementById("profileModal").style.display = "none";
    };

    return (
        <>
        {children ? (
            <span onClick={openModal}>{children}</span>
        ) : (
            <button style={{ display: "flex" }} onClick={openModal} >
            View Profile
            </button>
        )}

        {/* Modal Structure */}
        <div id="profileModal" className="modal">
            <div className="modal-content">
            <div className="modal-header">
                <span className="close" onClick={closeModal}>
                &times;
                </span>
                <h2 style={{ fontSize: "40px", textAlign: "center" }}>
                {user.name}
                </h2>
            </div>
            <div className="modal-body" style={{ textAlign: "center", marginTop: "30px"}}>
                <img
                src={user.pic ? `data:image/png;base64,${user.pic}` : 'defaultImageUrl'} // replace 'defaultImageUrl' with a URL for a default image if pic is not available
                alt={user.name}
                style={{ borderRadius: "50%", width: "150px", height: "150px" }}
                />
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            </div>
        </div>
        </>
    );
};

export default ProfileModel;