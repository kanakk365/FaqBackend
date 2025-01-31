import  { useState, useEffect } from 'react';
import axios from 'axios';
import { routeApi } from '../utils/routeApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    ['align', { align: [] }],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
  'color', 'background',
  'blockquote', 'code-block',
  'align'
];


const extractTextFromHTML = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [language, setLanguage] = useState('en');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, [language]);

  const handleEditorChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(routeApi.get, { params: { lang: language } });
      const formattedFaqs = response.data.faqs.map(faq => ({
        ...faq,
        question: extractTextFromHTML(faq.question),
        answer: extractTextFromHTML(faq.answer)
      }));
      setFaqs(formattedFaqs);
      setError('');
    } catch (err ) {
      setError('Error fetching FAQs' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(routeApi.create, formData);
      setShowCreateModal(false);
      setFormData({ question: '', answer: '' });
      fetchFaqs();
    } catch (err) {
      setError('Error creating FAQ' + err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${routeApi.update}/${editingFaq.id}`, formData);
      setShowEditModal(false);
      fetchFaqs();
    } catch (err) {
      setError('Error updating FAQ' + err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axios.delete(`${routeApi.delete}/${id}`);
        fetchFaqs();
      } catch (err) {
        setError('Error deleting FAQ' + err);
      }
    }
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer
    });
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">FAQ Management</h1>
      
      <div className="flex justify-between items-center mb-6">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
        </select>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create New FAQ
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{faq.question}</h3>
              <p className="text-gray-600 mb-4">{faq.answer}</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openEditModal(faq)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(faq.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Create New FAQ</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Question:</label>
                <ReactQuill
                  theme="snow"
                  value={formData.question}
                  onChange={(value) => handleEditorChange(value, 'question')}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-lg"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Answer:</label>
                <ReactQuill
                  theme="snow"
                  value={formData.answer}
                  onChange={(value) => handleEditorChange(value, 'answer')}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-lg h-48 mb-8"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors z-50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Edit FAQ</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Question:</label>
                <ReactQuill
                  theme="snow"
                  value={formData.question}
                  onChange={(value) => handleEditorChange(value, 'question')}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-lg"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Answer:</label>
                <ReactQuill
                  theme="snow"
                  value={formData.answer}
                  onChange={(value) => handleEditorChange(value, 'answer')}
                  modules={modules}
                  formats={formats}
                  className="bg-white rounded-lg h-48 mb-8"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors z-50"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Faq;