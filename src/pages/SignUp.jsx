import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const institutionRef = useRef();
  const countryRef = useRef();
  const phoneNumberRef = useRef();
  const reviewerInterestRef = useRef();

  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+91');
  
  const navigate=useNavigate();

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const codes = data
          .map((country) => {
            const name = country.name?.common;
            const code = country.idd?.root && country.idd?.suffixes
              ? `${country.idd.root}${country.idd.suffixes[0]}`
              : null;
            return code ? { name, code } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      })
      .catch((error) => {
        console.error('Error fetching country codes:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const fullPhone = `${selectedCode}${phoneNumberRef.current.value}`;
    const data = {
      user: {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
      },
      institution: institutionRef.current.value,
      country: countryRef.current.value,
      phone_number: fullPhone,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/author/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const responseData = isJson ? await response.json() : null;
  
      if (!response.ok) {
        console.error('Error response:', responseData);
  
        if (response.status === 400 && responseData) {
          const extractMessages = (obj, prefix = '') => {
            let messages = [];
            for (const key in obj) {
              const value = obj[key];
              const fullKey = prefix ? `${prefix}.${key}` : key;
              if (Array.isArray(value)) {
                messages.push(`${fullKey}: ${value.join(', ')}`);
              } else if (typeof value === 'object') {
                messages = messages.concat(extractMessages(value, fullKey));
              }
            }
            return messages;
          };
  
          const messages = extractMessages(responseData);
          alert(messages.join('\n') || 'Validation error occurred.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
  
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      alert('Registration successful!');
      console.log('Success:', responseData);
      navigate('/login');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Check console for details.');
    }
  };
  
  

  return (
    <div className="container mt-5">
      <div className="p-4 border border-primary rounded shadow-lg">
        <h2 className="mb-4 text-primary text-center">Author Sign Up</h2>
        <form onSubmit={handleSubmit} className="row g-4">
          {/* Name Fields */}
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input type="text" ref={firstNameRef} className="form-control border-primary" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input type="text" ref={lastNameRef} className="form-control border-primary" required />
          </div>

          {/* Account Fields */}
          <div className="col-md-6">
            <label className="form-label">Username</label>
            <input type="text" ref={usernameRef} className="form-control border-primary" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" ref={emailRef} className="form-control border-primary" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" ref={passwordRef} className="form-control border-primary" required />
          </div>

          {/* Phone Input */}
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <div className="input-group">
              <select
                className="form-select border-primary"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                style={{ maxWidth: '120px' }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                ref={phoneNumberRef}
                className="form-control border-primary"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Institution & Country */}
          <div className="col-md-6">
            <label className="form-label">Institution</label>
            <input type="text" ref={institutionRef} className="form-control border-primary" />
          </div>

          <div className="col-md-6">
            <label className="form-label">Country</label>
            <input type="text" ref={countryRef} className="form-control border-primary" />
          </div>
          {/* Submit Button */}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-outline-primary px-5">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
