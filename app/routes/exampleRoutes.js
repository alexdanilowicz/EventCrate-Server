import * as exampleController from '../controllers/exampleController';

module.exports = (app) => {
  // entry routes
  app.route('/test')
    .get(exampleController.exampleFunction);
};
