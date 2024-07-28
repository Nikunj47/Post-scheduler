import React, { useState } from 'react';

const Form = () => {
    const [title, setTitle] = useState(''); // initialized with an empty string
    const [body, setBody] = useState('');  // initialized with an empty string
    const [media, setMedia] = useState(null); // remains as null
    const [scheduledTime, setScheduledTime] = useState(''); // changed from null to empty string


    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Title:', title);
        console.log('Body:', body);
        console.log('Media:', media);
        console.log('Scheduled Time:', scheduledTime);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="body">Body:</label>
                <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="media">Upload Media:</label>
                <input
                    type="file"
                    id="media"
                    onChange={(e) => setMedia(e.target.files[0])}
                />
            </div>
            <div>
                <label htmlFor="scheduledTime">Schedule Time:</label>
                <input
                    type="datetime-local"
                    id="scheduledTime"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default Form;