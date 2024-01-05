import React, { useState } from 'react';

function Chat() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  

  const sendMessage = async (data) => {
    try {
      const response = await fetch('http://gp2023.duckdns.org/api/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        "to": "user1@localhost",
        body: JSON.stringify(data),

      });

      if (response.ok) {
        console.log('Message sent successfully!');
        // Handle success, e.g., show a success message or reset the form
      } else {
        console.error('Failed to send the message');
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Unexpected error occurred', error);
      // Handle error, e.g., show an error message
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
/*
    const sendMessageData = {
      recipient: recipient,
      message: message,
    };

    // Send the message to the server
    sendMessage(sendMessageData);*/
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Recipient:</label>
        <input
          type="text"
          value={recipient}
          onChange={handleRecipientChange}
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea value={message} onChange={handleMessageChange} />
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}

export default Chat;