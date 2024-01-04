import express from 'express'
import { creatNewTour, deleteTour, getAllTours, getTour, idCheck, updateTour, getTopTours, getTourStats, getMonthlyPlan } from './../Controller/tourContoller.js';

const tourRouter = express.Router();
// tourRouter.param('id', idCheck);

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter.route('/tourStat').get(getTourStats);
tourRouter.route('/getTopTours').get(getTopTours, getAllTours);
tourRouter.route('/tours').get(getAllTours).post(creatNewTour);
tourRouter.route('/tour/:_id').get(getTour).patch(updateTour).delete(deleteTour);
export { tourRouter };