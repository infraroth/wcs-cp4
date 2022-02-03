import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditArt = () => {
  const params = useParams();
  const [art, setArt] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getArt();
  }, []);

  const formData = new FormData();
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const getArt = () => {
    axios.get(`http://localhost:8000/art/${params.id}`).then((response) => {
      setArt(response.data);
      setName(response.data.name);
      setImage(response.data.image);
      setDescription(response.data.description);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.append('name', name);
    formData.append('description', description);
    if (typeof image !== 'string') {
      formData.append('img', image);
    } else {
      formData.append('image', image);
    }
    axios
      .put(`http://localhost:8000/art/${params.id}`, formData, config)
      .then(({ data }) => {
        if (data.error) setError(data.error);
      })
      .then(() => setMessage(`${art.name} has been updated!`));
  };

  return (
    <section className="admin items-stretch relative">
      <div className="h-full w-full bg-gray-50 relative overflow-y-auto">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 px-5 py-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              {error && <p className="register-error">{error}</p>}
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium font-bold text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={name}
                      className="mt-3 border border-gray-300 px-2 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium font-bold text-gray-700"
                      >
                        Image
                      </label>
                      <div className="mt-5 rounded-md shadow-sm">
                        {art.image && <img src={art.image} alt={art.image} />}
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="mt-5 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          onChange={handleImage}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="Description"
                      className="block text-sm font-medium font-bold text-gray-700"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 px-2 py-2 rounded-md"
                        placeholder="Description"
                        defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-5 py-5 bg-white text-right sm:px-6">
                  {error && (
                    <div
                      className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
                      role="alert"
                    >
                      <svg
                        className="w-5 h-5 inline mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <div>
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                  {message && (
                    <div
                      className="flex bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700"
                      role="alert"
                    >
                      <svg
                        className="w-5 h-5 inline mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <div>
                        <span className="font-medium">{message}</span>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    value="Send"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default EditArt;
