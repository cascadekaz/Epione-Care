// import { useState, useEffect } from "react";
// import "./AddPatient.css";

// function AddPatient() {
//   const initialValues = { 
//     name: "", 
//     age: "", 
//     gender: "", 
//     email: "" 
//   };
  
//   const [formValues, setFormValues] = useState(initialValues);
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmit, setIsSubmit] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFormErrors(validate(formValues));
//     setIsSubmit(true);
//   };

//   useEffect(() => {
//     if (Object.keys(formErrors).length === 0 && isSubmit) {
//       console.log("Form submitted:", formValues);
//       // Here you would typically send the data to your backend
//       alert("Patient added successfully!");
//       setFormValues(initialValues); // Reset form after submission
//       setIsSubmit(false);
//     }
//   }, [formErrors]);

//   const validate = (values) => {
//     const errors = {};
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
//     if (!values.name) {
//       errors.name = "Name is required!";
//     } else if (values.name.length < 3) {
//       errors.name = "Name must be at least 3 characters";
//     }
    
//     if (!values.age) {
//       errors.age = "Age is required!";
//     } else if (isNaN(values.age)) {
//       errors.age = "Age must be a number";
//     } else if (values.age < 0 || values.age > 120) {
//       errors.age = "Please enter a valid age (0-120)";
//     }
    
//     if (!values.gender) {
//       errors.gender = "Gender is required!";
//     }
    
//     if (!values.email) {
//       errors.email = "Email is required!";
//     } else if (!regex.test(values.email)) {
//       errors.email = "This is not a valid email format!";
//     }
    
//     return errors;
//   };

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit}>
//         <h1>Add New Patient</h1>
//         <div className="ui divider"></div>
//         <div className="ui form">
//           <div className="field">
//             <label>Full Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Patient's full name"
//               value={formValues.name}
//               onChange={handleChange}
//             />
//             <p className="error">{formErrors.name}</p>
//           </div>
          
//           <div className="field">
//             <label>Age</label>
//             <input
//               type="number"
//               name="age"
//               placeholder="Patient's age"
//               value={formValues.age}
//               onChange={handleChange}
//               min="0"
//               max="120"
//             />
//             <p className="error">{formErrors.age}</p>
//           </div>
          
//           <div className="field">
//             <label>Gender</label>
//             <select
//               name="gender"
//               value={formValues.gender}
//               onChange={handleChange}
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//               <option value="prefer-not-to-say">Prefer not to say</option>
//             </select>
//             <p className="error">{formErrors.gender}</p>
//           </div>
          
//           <div className="field">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Patient's email"
//               value={formValues.email}
//               onChange={handleChange}
//             />
//             <p className="error">{formErrors.email}</p>
//           </div>
          
//           <button className="fluid ui button blue" type="submit">Add Patient</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AddPatient;