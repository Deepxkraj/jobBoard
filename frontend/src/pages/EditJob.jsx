import React from 'react';
import { useParams } from 'react-router-dom';

const EditJob = () => {
  const { id } = useParams();

  return (
    <div className="edit-job-container">
      <div className="container">
        <h1>Edit Job</h1>
        <p>Job ID: {id}</p>
        <p>This page will allow employers to edit their job postings.</p>
      </div>
    </div>
  );
};

export default EditJob;
