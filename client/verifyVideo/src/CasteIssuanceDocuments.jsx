import React from 'react';

const CasteIssuanceDocuments = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    list: {
      listStyleType: 'none',
      paddingLeft: '0',
    },
    listItem: {
      backgroundColor: '#e7f1ff',
      border: '1px solid #007bff',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    },
    note: {
      marginTop: '20px',
      color: '#555',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Documents Required for Caste Issuance</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>1. Proof of Identity (Aadhar Card, Passport, etc.)</li>
        <li style={styles.listItem}>2. Proof of Residence (Utility Bill, Rent Agreement, etc.)</li>
        <li style={styles.listItem}>3. Caste Certificate of Parents/Guardian</li>
        <li style={styles.listItem}>4. Recent Passport-sized Photographs (2-3 copies)</li>
        {/* <li style={styles.listItem}>5. Application Form (available at the office)</li> */}
      </ul>
      <p style={styles.note}>
        Note: Ensure all documents are submitted in the required format.
      </p>
    </div>
  );
};

export default CasteIssuanceDocuments;
