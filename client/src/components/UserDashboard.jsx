import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const [userArt, setUserArt] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [accountError, setAccountError] = useState('');

  const formData = new FormData();
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  useEffect(() => {
    getUserArt();
    setUsername(user.username);
    setEmail(user.email);
    setOldPassword(user.password);
  }, []);

  const getUserArt = () => {
    axios.get(`http://localhost:8000/art/user/${user.id}`).then(({ data }) => {
      setUserArt(data);
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const postArt = (e) => {
    e.preventDefault();
    if (name && image && description) {
      formData.append('name', name);
      formData.append('description', description);
      formData.append('img', image);
      formData.append('user_id', user.id);
      axios
        .post('http://localhost:8000/art', formData, config)
        .then(({ data }) => {
          if (data.error) setError(data.error);
          else {
            setError('');
            setName('');
            setImage('');
            setDescription('');
            setMessage('Art has been added successfully!');
          }
        });
    } else setError('All fields are required!');
  };

  const deleteArt = (id) => {
    axios.delete(`http://localhost:8000/art/${id}`).then(({ data }) => {
      if (data.error) setError(data.error);
      else {
        setError('');
        window.location.reload();
      }
    });
  };

  const updateAccount = (e) => {
    e.preventDefault();
    if (oldPassword) {
      const updatedUser = {
        email: email,
        oldPassword: oldPassword,
        password: password,
        username: username,
      };
      axios
        .put(`http://localhost:8000/account/${user.id}`, updatedUser)
        .then(({ data }) => {
          if (data.error) setAccountError(data.error);
          else {
            localStorage.clear();
            window.location.href = '/login';
          }
        });
    } else {
      setError('Please enter actual password');
    }
  };

  return (
    <>
      <section className="admin items-stretch relative">
        <div className="h-full w-full bg-gray-50 relative overflow-y-auto">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            {/* Add art */}
            <div className="mt-5 px-5 py-5 md:mt-0 md:col-span-2">
              <form onSubmit={postArt}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="text-gray-800 text-2xl flex justify-center border-b-2 py-2 mb-4">
                      Add artwork
                    </div>
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
                      Add art
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* Update account */}
            <div className="mt-5 px-5 py-5 md:mt-0 md:col-span-1">
              <form
                className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4"
                onSubmit={updateAccount}
              >
                <div className="text-gray-800 text-2xl flex justify-center border-b-2 py-2 mb-4">
                  Update account
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="username"
                    v-model="form.username"
                    type="text"
                    id="username"
                    value={username}
                    placeholder="username"
                    required="required"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="email"
                    v-model="form.email"
                    type="email"
                    id="email"
                    value={email}
                    placeholder="votre email"
                    required="required"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="oldpassword"
                  >
                    Actual password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.password"
                    type="password"
                    placeholder="Actual password"
                    name="oldpassword"
                    id="oldpassword"
                    value={oldPassword}
                    required="required"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="password"
                  >
                    New password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    v-model="form.password"
                    type="password"
                    placeholder="New password"
                    name="password"
                    id="password"
                    value={password}
                    required="required"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  {accountError && (
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
                  <button
                    className="px-4 py-2 rounded text-white inline-block shadow-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20 lg:py-[120px]">
        <table className="min-w-full table-auto">
          <thead className="justify-between">
            <tr className="bg-gray-800">
              <th className="px-16 py-2">
                <span className="text-gray-300">Thumb</span>
              </th>
              <th className="px-16 py-2">
                <span className="text-gray-300">Name</span>
              </th>
              <th className="px-16 py-2">
                <span className="text-gray-300">Edit</span>
              </th>
              <th className="px-16 py-2">
                <span className="text-gray-300">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-200">
            {userArt?.map((art) => (
              <tr key={art.id} className="bg-white border-4 border-gray-200">
                <td className="px-16 py-2 flex flex-row items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover "
                    src={art.image}
                    alt={art.name}
                  />
                </td>
                <td>
                  <span className="text-center ml-2 font-semibold">
                    {art.name}
                  </span>
                </td>
                <td className="px-16 py-2">
                  <Link to={`/account/art/${art.id}`}>
                    <button className="bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-white hover:border-indigo-500 hover:text-black ">
                      Edit
                    </button>
                  </Link>
                </td>
                <td className="px-16 py-2">
                  <button
                    onClick={() => deleteArt(art.id)}
                    className="bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-white hover:border-indigo-500 hover:text-black "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default UserDashboard;
