import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/plan">Plan</Link></li>
                <li><Link to="/create">Create</Link></li>
                <li><Link to="/inbox">Inbox</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
                <li><Link to="/listening">Listening</Link></li>
                <li><Link to="/ads">Ads</Link></li>
                <li><Link to="/more">More</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;