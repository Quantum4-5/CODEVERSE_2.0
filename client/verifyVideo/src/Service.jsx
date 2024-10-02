import React from 'react';
import './Service.css';

function Service() {
  const steps = [
    {
      id: 1,
      title: 'Select a Service',
      description: 'Choose any of the available services.',
    },
    {
      id: 2,
      title: 'Complete the Form',
      description: 'Accurately fill out the required form with your details.',
    },
    {
      id: 3,
      title: 'Submit the Form',
      description: 'Submit your completed form and await verification.',
    },
    {
      id: 4,
      title: 'Receive Your Certificate',
      description: 'Collect your certificate at your doorstep or from local government offices such as the ward or municipality.',
    },
  ];

  return (
    <div className="App">
      <div className="header">
        <h1>How to Use Our Services</h1>
        <div className="underline"></div>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <div className="step" key={step.id}>
            <div className="step-number">{step.id}</div>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
            {/* Add arrow for steps 1-3 */}
            {step.id < 4 && <span className="arrow">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
