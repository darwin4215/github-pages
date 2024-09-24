import React from 'react';
import { Link } from 'react-router-dom';

const PublisherLink = ({ houseName }) => {
    return (
        <Link to={`/publisher/${houseName}`}>{houseName}</Link>
    );
};

export default PublisherLink;
