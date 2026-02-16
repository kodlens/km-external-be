import React, { useState } from 'react';


const SetPublishDate: React.FC = () => {
    const [publishDate, setPublishDate] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div>
            <h1>Set Publish Date</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="publishDate">Publish Date:</label>
                    <input
                        type="date"
                        id="publishDate"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                    />
                </div>
                <button type="submit">Set Date</button>
            </form>
        </div>
    );
};

export default SetPublishDate;