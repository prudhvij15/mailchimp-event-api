import React, { useState } from "react";
import "./form.css";
import logo from "./logo.jpeg";
export default function Form() {
  const [email, setEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [listID, setListID] = useState("");
  const [customProperties, setCustomProperties] = useState([]);
  const [error, setError] = useState([]);

  const handlePropertyChange = (index, key, value) => {
    const updatedProperties = [...customProperties];
    updatedProperties[index] = { key, value };
    setCustomProperties(updatedProperties);
  };

  const addProperty = () => {
    setCustomProperties([...customProperties, { key: "", value: "" }]);
  };

  const removeProperty = (index) => {
    const updatedProperties = [...customProperties];
    updatedProperties.splice(index, 1);
    setCustomProperties(updatedProperties);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      name: eventName,
      listID: listID,
      properties: Object.fromEntries(
        customProperties.map(({ key, value }) => [key, value])
      ),
    };

    try {
      const response = await fetch("http://localhost:3001/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.text();

      if (response.status === 204) {
        console.log("Success: No content");
        setError([]);
      } else {
        try {
          const parsedData = JSON.parse(responseData);
          console.log("Mailchimp ERR:", parsedData);
          setError([parsedData]);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setError([responseData]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError([error.message]);
    }
  };

  return (
    <div className="form-container">
      <div
        style={{
          display: "flex",
          margin: "auto",
          gap: "20px",
          height: "auto ",
        }}
      >
        <img
          src={logo}
          style={{ width: "15%", height: "20%", borderRadius: "50%" }}
          alt="LOGO"
        />
        <h4>Mailchimp Events API</h4>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Audience ID</label>
        <input
          type="text"
          required
          onChange={(e) => setListID(e.target.value)}
        />
        <label>Enter Email Address</label>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Enter Event Name</label>
        <input
          type="text"
          required
          onChange={(e) => setEventName(e.target.value)}
        />

        {customProperties.map((property, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Property Key"
              value={property.key}
              onChange={(e) =>
                handlePropertyChange(index, e.target.value, property.value)
              }
            />
            <input
              type="text"
              placeholder="Property Value"
              value={property.value}
              onChange={(e) =>
                handlePropertyChange(index, property.key, e.target.value)
              }
            />
            <button type="button" onClick={() => removeProperty(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addProperty}>
          Add Property
        </button>

        <button type="submit">Submit</button>
      </form>

      {error.length > 0 && (
        <div className="error-container">
          <table>
            <thead>
              <tr>
                {Object.keys(error[0]).map((key) => (
                  <th key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {error.map((err, index) => (
                <tr key={index} className="error-item">
                  {Object.values(err).map((value, subIndex) => (
                    <td key={subIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
