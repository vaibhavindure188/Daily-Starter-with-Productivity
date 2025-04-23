import React, { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";

const EmailSection = ({ userEmail }) => {
  const { emails, fetchEmails } = useContext(AppContext);

  useEffect(() => {
    if (userEmail) {
      fetchEmails(userEmail);
    }
  }, [userEmail, fetchEmails]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Unread Emails</h2>
      {emails.length > 0 ? (
        <ul className="space-y-3">
          {emails.map((email) => (
            <li key={email.id} className="p-3 border-b last:border-none">
              <p className="font-semibold">{email.subject}</p>
              <p className="text-sm text-gray-600">From: {email.from}</p>
              <p className="text-sm text-gray-500">{email.snippet}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No unread emails</p>
      )}
    </div>
  );
};

export default EmailSection;
