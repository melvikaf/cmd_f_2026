import React, { useState } from "react";
import { Bell, X } from "lucide-react";

import "./Dashboard.css";
import Card from "../../components/Card/Card";
import NavBar from "../../components/NavBar/NavBar";

const users = [
    {
        id: 1,
        name: "Sarah",
        age: 26,
        distance: "1 mile away",
        description: "Artist and dog lover. Always up for an adventure.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
        tags: ["art", "dogs", "hiking"],
    },
    {
        id: 2,
        name: "Emma",
        age: 24,
        distance: "3 miles away",
        description: "Coffee addict and weekend traveler.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
        tags: ["coffee", "travel", "music"],
    },
    {
        id: 3,
        name: "Olivia",
        age: 27,
        distance: "2 miles away",
        description: "Photographer and nature lover.",
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
        tags: ["photography", "nature", "hiking"],
    },
];

const Dashboard: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextUser = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPrevUser = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentUser = users[currentIndex];

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <h1 className="dashboard__title">Discover</h1>
                <p className="dashboard__subtitle">Find your perfect match</p>
            </div>

            <div className="centerCard">
                <Card
                    name={currentUser.name}
                    age={currentUser.age}
                    distance={currentUser.distance}
                    description={currentUser.description}
                    image={currentUser.image}
                    tags={currentUser.tags}
                />
            </div>

            <div className="dashboard__actions">
                <button
                    className="dashboard__action dashboard__action--primary"
                    onClick={goToNextUser}
                    type="button"
                >
                    <Bell size={30} fill="currentColor" />
                </button>

                <button
                    className="dashboard__action dashboard__action--secondary"
                    onClick={goToPrevUser}
                    type="button"
                >
                    <X size={32} />
                </button>
            </div>


        </div>
    );
};

export default Dashboard;