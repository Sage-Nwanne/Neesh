import { useState, useEffect } from 'react';
import { adminSubmissionsData } from '../../data/dummyData';
import styles from './SubmissionReview.module.css';

const SubmissionReview = ({ onUpdate }) => {
  const [submissions, setSubmissions] = useState(adminSubmissionsData);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleApprove = (id) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: 'approved' } : sub
    ));
    onUpdate?.();
  };

  const handleReject = (id) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: 'rejected' } : sub
    ));
    onUpdate?.();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.submissionReview}>
      <div className={styles.header}>
        <h2>Submission Review</h2>
        <div className={styles.stats}>
          <span>{submissions.filter(s => s.status === 'pending').length} pending submissions</span>
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <div className={styles.submissionsList}>
          {submissions.map(submission => (
            <div key={submission.id} className={styles.submissionCard}>
              <div className={styles.submissionHeader}>
                <img src={submission.cover_image_url} alt={submission.title} className={styles.coverImage} />
                <div className={styles.submissionInfo}>
                  <h3>{submission.title}</h3>
                  <p className={styles.publisher}>by {submission.publisher}</p>
                  <p className={styles.category}>{submission.category} • ${submission.price}</p>
                  <p className={styles.details}>{submission.pages} pages • Print run: {submission.print_run}</p>
                </div>
                <div className={styles.submissionStatus}>
                  <span className={`${styles.status} ${styles[submission.status]}`}>
                    {submission.status}
                  </span>
                  <p className={styles.date}>
                    Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className={styles.submissionDescription}>
                <p>{submission.description}</p>
              </div>
              
              {submission.status === 'pending' && (
                <div className={styles.actions}>
                  <button 
                    className={styles.approveBtn}
                    onClick={() => handleApprove(submission.id)}
                  >
                    Approve
                  </button>
                  <button 
                    className={styles.rejectBtn}
                    onClick={() => handleReject(submission.id)}
                  >
                    Reject
                  </button>
                  <button 
                    className={styles.detailsBtn}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionReview;
