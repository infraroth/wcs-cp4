import artController from '../controllers/artController.js';
import accountController from '../controllers/accountController.js';

export const setupRoutes = (app) => {
    app.use('/art', artController);
    app.use('/account', accountController);
}