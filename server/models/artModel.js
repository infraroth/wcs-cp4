import dbConnect from '../config/db-config.js';

const getAll = () => {
  return new Promise((resolve, reject) => {
      dbConnect.query(`SELECT a.id, a.name, a.description, a.image,
      JSON_REMOVE(JSON_OBJECTAGG(IFNULL(u.id, 'null__'), u.username), '$.null__') AS user
      FROM artwork AS a
      LEFT JOIN user_artwork AS ua ON a.id = ua.artwork_id
      LEFT JOIN user AS u ON u.id = ua.user_id
      GROUP BY a.id`, (err, results) => {   
          if (err) reject(err);
          else resolve(results);
      })
  })
}

const getAllByUser = (id) => {
  return new Promise((resolve, reject) => {
      dbConnect.query(`SELECT a.id, a.name, a.description, a.image AS art, ua.user_id
      FROM user_artwork AS ua
      LEFT JOIN artwork AS a ON a.id = ua.artwork_id
      LEFT JOIN user AS u ON u.id = ua.user_id
      WHERE ua.user_id = ?
      GROUP BY a.id`, id, (err, results) => {   
          if (err) reject(err);
          else resolve(results);
      })
  })
}

const getOneById = (id) => {
  return new Promise((resolve, reject) => {
      dbConnect.query(`SELECT a.id, a.name, a.description, a.image,
      JSON_REMOVE(JSON_OBJECTAGG(IFNULL(u.id, 'null__'), u.username), '$.null__') AS user
      FROM artwork AS a
      LEFT JOIN user_artwork AS ua ON a.id = ua.artwork_id
      LEFT JOIN user AS u ON u.id = ua.user_id
      WHERE a.id = ?
      GROUP BY a.id`, id, (err, result) => {
          if (err) reject(err);
          else resolve(result[0]);
      })
  })
}

const createNew = (art) => {
  const { name, description, image } = art;
  return new Promise((resolve, reject) => {
      dbConnect.query('INSERT INTO artwork (name, description, image) VALUES (?, ?, ?)',
          [name, description, image], (err, result) => {
              if (err) reject(err);
              else resolve(result.insertId);
          })
  })
}

const addUserToArt = (user_id, artwork_id) => {
  return new Promise((resolve, reject) => {
      dbConnect.query('INSERT INTO user_artwork (user_id, artwork_id) VALUES (?, ?)', [user_id, artwork_id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
      })
  })
}

const updateArt = (id, art) => {
  return new Promise((resolve, reject) => {
      dbConnect.query('UPDATE artwork SET ? WHERE id = ?', [art, id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
      })
  })
}

const deleteById = (id) => {
  return new Promise((resolve, reject) => {
      dbConnect.query('DELETE FROM artwork WHERE id = ?', id, (err, result) => {
          if (err) reject(err);
          else resolve(result.affectedRows);
      })
  })
}

export default {getAll, createNew, getOneById, addUserToArt, getAllByUser, updateArt, deleteById}