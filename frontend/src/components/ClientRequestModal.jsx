import { useState } from 'react';

const ClientRequestModal = ({ client, onClose }) => {
  // Destructure client data
  const { name, profile_image, requestDetails: rawRequestDetails } = client;

  // Normalize requestDetails to handle both snake_case and camelCase
  const requestDetails = {
  title: client.title,
  budget: client.budget,
  event_date: client.event_date,
  location: client.location,
  phone: client.phone,
  email: client.email,
  message: client.message,
  attachment_url: client.attachment_url,
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Hire Request from {name}</h2>
          <p className="text-gray-600 mb-6">Details submitted in the hire form</p>

          <div className="space-y-5">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <p className="text-gray-900 mt-1">{requestDetails.title}</p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget</label>
              <p className="text-gray-900 mt-1">{requestDetails.budget}</p>
            </div>

            {/* Event Date */}
            {requestDetails.eventDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Date</label>
                <p className="text-gray-900 mt-1">
                  {new Date(requestDetails.eventDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Location */}
            {requestDetails.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900 mt-1">{requestDetails.location}</p>
              </div>
            )}

            {/* Phone */}
            {requestDetails.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="text-gray-900 mt-1">{requestDetails.phone}</p>
              </div>
            )}

            {/* Email */}
            {requestDetails.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <p className="text-gray-900 mt-1">{requestDetails.email}</p>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{requestDetails.message}</p>
            </div>

            {/* Attachment */}
            {requestDetails.attachmentUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Attachment</label>
                <a
                  href={requestDetails.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📎 Download File
                </a>
              </div>
            )}
          </div>

          {/* Client Contact */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Contact {name}</h3>
            {client.whatsapp && (
              <a
                href={`https://wa.me/${client.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                💬 Message on WhatsApp
              </a>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRequestModal;