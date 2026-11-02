import { useState } from "react";

function PatientRegistration() {
  const initialFormState = {
    name: "",
    age: "",
    gender: "",
    address: "",
    mono: "",
    email: "",
    dob: "",
    bloodgroup: "",
    regdate: "",
    dept: "",
    testsel: [],
    pad: "",
    scp: "",
    udp: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Helper for date checks
  const getMidnightToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Field validator function
  const validateSingleField = (name, value) => {
    const today = getMidnightToday();

    switch (name) {
      case "name": {
        const val = (value || "").trim();
        if (!val) return "Name cannot be empty";
        if (!/^[A-Za-z ]+$/.test(val)) return "Name should contain only letters and spaces";
        if (val.length < 2) return "Name must be at least 2 characters long";
        return "";
      }
      case "age": {
        const val = (value || "").toString().trim();
        const num = Number(val);
        if (!val) return "Age cannot be empty";
        if (!/^\d+$/.test(val) || num < 1 || num > 120) return "Enter a valid age between 1 and 120";
        return "";
      }
      case "gender": {
        if (!value) return "Please select a gender";
        return "";
      }
      case "address": {
        const val = (value || "").trim();
        if (!val) return "Address cannot be empty";
        if (val.length < 5) return "Address must be at least 5 characters long";
        return "";
      }
      case "mono": {
        const val = (value || "").trim();
        if (!val) return "Mobile number cannot be empty";
        if (!/^[6-9][0-9]{9}$/.test(val)) return "Enter a valid 10-digit Indian mobile number (starts with 6-9)";
        return "";
      }
      case "email": {
        const val = (value || "").trim();
        if (!val) return "Email cannot be empty";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return "Enter a valid email address (e.g. user@example.com)";
        return "";
      }
      case "dob": {
        if (!value) return "Date of birth cannot be empty";
        const d = new Date(value + "T00:00:00");
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 125);
        if (isNaN(d.getTime())) return "Enter a valid date of birth";
        if (d > today) return "Date of birth cannot be in the future";
        if (d < minDate) return "Date of birth cannot be more than 120 years ago";
        return "";
      }
      case "bloodgroup": {
        if (!value) return "Please select a blood group";
        return "";
      }
      case "regdate": {
        if (!value) return "Registration date cannot be empty";
        const d = new Date(value + "T00:00:00");
        if (isNaN(d.getTime())) return "Enter a valid registration date";
        if (d > today) return "Registration date cannot be in the future";
        return "";
      }
      case "dept": {
        if (!value) return "Please select a department";
        return "";
      }
      case "testsel": {
        if (!value || value.length === 0) return "Please select at least one test";
        return "";
      }
      case "pad": {
        if (!value) return "Preferred appointment date cannot be empty";
        const d = new Date(value + "T00:00:00");
        if (isNaN(d.getTime())) return "Enter a valid appointment date";
        if (d < today) return "Appointment date cannot be in the past";
        return "";
      }
      case "scp": {
        if (!value) return "Please select sample collection preference";
        return "";
      }
      case "udp": {
        if (!value) return "Please upload doctor's prescription";
        const allowedExtensions = /\.(pdf|jpe?g|png)$/i;
        if (!allowedExtensions.test(value.name || "")) return "Allowed formats: PDF, JPG, JPEG, PNG";
        return "";
      }
      default:
        return "";
    }
  };

  // Real-time reactive change handler:
  // If the user previously saw an alert or submitted, fixing the field IMMEDIATELY removes the alert!
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let updatedValue = value;

    if (type === "checkbox") {
      const currentList = formData.testsel || [];
      if (checked) {
        updatedValue = [...currentList, value];
      } else {
        updatedValue = currentList.filter((item) => item !== value);
      }
    } else if (type === "file") {
      updatedValue = files && files[0] ? files[0] : null;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Reactive alert removal:
    if (submitted || errors[name]) {
      const fieldError = validateSingleField(name, updatedValue);
      setErrors((prev) => {
        const next = { ...prev };
        if (!fieldError) {
          delete next[name]; // Field returns to normal immediately upon entering valid data!
        } else {
          next[name] = fieldError;
        }
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const errorMsg = validateSingleField(name, formData[name]);
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateSingleField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Registration successful");
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSubmitted(false);
  };

  const isInvalid = (field) => Boolean(errors[field]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
      <h1>Online Registration</h1>
      <hr />

      <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
        {/* Fieldset 1: Personal Details */}
        <fieldset>
          <legend>Personal Details</legend>

          <label htmlFor="name">Patient Name:</label>{" "}
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your Full name"
            className={isInvalid("name") ? "invalid" : ""}
            autoFocus
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
          <br /><br />

          <label htmlFor="age">Age:</label>{" "}
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your Age"
            className={isInvalid("age") ? "invalid" : ""}
          />
          {errors.age && <span className="error-msg">{errors.age}</span>}
          <br /><br />

          <label>Gender:</label>{" "}
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
              className={isInvalid("gender") ? "invalid" : ""}
            />
            Male
          </label>{" "}
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
              className={isInvalid("gender") ? "invalid" : ""}
            />
            Female
          </label>
          {errors.gender && <span className="error-msg">{errors.gender}</span>}
          <br /><br />

          <label htmlFor="address">Address:</label>{" "}
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your Address"
            className={isInvalid("address") ? "invalid" : ""}
          />
          {errors.address && <span className="error-msg">{errors.address}</span>}
          <br /><br />
        </fieldset>

        {/* Fieldset 2: Patient's Contact */}
        <fieldset>
          <legend>Patient's Contact</legend>

          <label htmlFor="mono">Mobile Number:</label>{" "}
          <input
            type="tel"
            id="mono"
            name="mono"
            value={formData.mono}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="9876543210"
            className={isInvalid("mono") ? "invalid" : ""}
          />
          {errors.mono && <span className="error-msg">{errors.mono}</span>}
          <br /><br />

          <label htmlFor="email">Email:</label>{" "}
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="arjunpathlabs@gmail.com"
            className={isInvalid("email") ? "invalid" : ""}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
          <br /><br />
        </fieldset>

        {/* Fieldset 3: Test & Appointment Details */}
        <fieldset>
          <legend>Test & Appointment Details</legend>

          <label htmlFor="dob">DOB:</label>{" "}
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isInvalid("dob") ? "invalid" : ""}
          />
          {errors.dob && <span className="error-msg">{errors.dob}</span>}
          <br /><br />

          <label htmlFor="bloodgroup">Blood Group:</label>{" "}
          <select
            id="bloodgroup"
            name="bloodgroup"
            value={formData.bloodgroup}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isInvalid("bloodgroup") ? "invalid" : ""}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodgroup && <span className="error-msg">{errors.bloodgroup}</span>}
          <br /><br />

          <label htmlFor="regdate">Registration Date:</label>{" "}
          <input
            type="date"
            id="regdate"
            name="regdate"
            value={formData.regdate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isInvalid("regdate") ? "invalid" : ""}
          />
          {errors.regdate && <span className="error-msg">{errors.regdate}</span>}
          <br /><br />

          <label htmlFor="dept">Department:</label>{" "}
          <select
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isInvalid("dept") ? "invalid" : ""}
          >
            <option value="">Select</option>
            <option value="General">General Physician</option>
            <option value="Pathology">Pathology</option>
            <option value="Cardiology">Cardiology</option>
          </select>
          {errors.dept && <span className="error-msg">{errors.dept}</span>}
          <br /><br />

          <label>Test Selection:</label>{" "}
          {["CBC", "HbA1c", "LFT", "KFT", "ECG"].map((test) => (
            <label key={test} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                name="testsel"
                value={test}
                checked={formData.testsel.includes(test)}
                onChange={handleChange}
                className={isInvalid("testsel") ? "invalid" : ""}
              />{" "}
              {test}
            </label>
          ))}
          {errors.testsel && <span className="error-msg">{errors.testsel}</span>}
          <br /><br />

          <label htmlFor="pad">Preferred Appointment Date:</label>{" "}
          <input
            type="date"
            id="pad"
            name="pad"
            value={formData.pad}
            onChange={handleChange}
            onBlur={handleBlur}
            className={isInvalid("pad") ? "invalid" : ""}
          />
          {errors.pad && <span className="error-msg">{errors.pad}</span>}
          <br /><br />
        </fieldset>

        {/* Fieldset 4: Sample & Prescription */}
        <fieldset>
          <legend>Sample & Prescription</legend>

          <label>Sample Collection Preference:</label>{" "}
          <label>
            <input
              type="radio"
              name="scp"
              value="Hc"
              checked={formData.scp === "Hc"}
              onChange={handleChange}
              className={isInvalid("scp") ? "invalid" : ""}
            />{" "}
            Home Collection
          </label>{" "}
          <label>
            <input
              type="radio"
              name="scp"
              value="Vl"
              checked={formData.scp === "Vl"}
              onChange={handleChange}
              className={isInvalid("scp") ? "invalid" : ""}
            />{" "}
            Visit Lab
          </label>
          {errors.scp && <span className="error-msg">{errors.scp}</span>}
          <br /><br />

          <label htmlFor="udp">Upload Doctor Prescription:</label>{" "}
          <input
            type="file"
            id="udp"
            name="udp"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className={isInvalid("udp") ? "invalid" : ""}
          />
          {errors.udp && <span className="error-msg">{errors.udp}</span>}
        </fieldset>

        <br /><br />
        <button type="submit">Register</button>{" "}
        <button type="reset">Reset</button>
      </form>
    </div>
  );
}

export default PatientRegistration;
