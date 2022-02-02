import dbConnect from '../config/db-config.js';

const getAll = () => {
  return new Promise((resolve, reject) => {
      dbConnect.query(`SELECT * FROM artwork`, (err, results) => {   
          if (err) reject(err);
          else resolve(results);
      })
  })
}

export default {getAll}