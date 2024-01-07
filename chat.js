import React, { useState, useEffect } from 'react';
import { client, xml } from '@xmpp/client';
import { useLocation } from 'react-router-dom';
import { createElement } from '@xmpp/xml';

function Chat() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const location = useLocation();
  const { state } = location;
  const { username, password } = state || {};

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const xmpp = client({
      service: 'ws://gp2023.duckdns.org:5280/ws',
      username: username,
      password: password,
    });

    try {
      await xmpp.start();

      const messageStanza = xml('message', { to: recipient, type: 'chat' }, [
        xml('body', {}, message),
      ]);

      await xmpp.send(messageStanza);

      console.log('Message sent successfully!');
      // Handle success, e.g., show a success message or reset the form
    } catch (error) {
      console.error('Failed to send the message', error);
      // Handle error, e.g., show an error message
    } finally {
      xmpp.stop();
    }
  };

  const handleChatMessage = (from, message) => {
    setReceivedMessage(`${from} says: ${message}`);
  };

  useEffect(() => {
    const xmpp = client({
      service: 'ws://gp2023.duckdns.org:5280/ws',
      username: username,
      password: password,
    });

    const connect = async () => {
      try {
        await xmpp.start();

        xmpp.on('chat', handleChatMessage);
      } catch (error) {
        console.error('Failed to connect to XMPP server', error);
      }
    };

    connect();

    return () => {
      xmpp.stop();
    };
  }, [username, password]);

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
      <div>
        <label>Received Message:</label>
        <div>{receivedMessage}</div>
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}

export default Chat;