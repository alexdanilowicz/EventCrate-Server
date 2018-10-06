import { Router } from 'express';
import * as AdminUserController from './controllers/adminUserController';
import * as ClubUserController from './controllers/clubUserController';
import * as EventController from './controllers/eventController';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// Clubs
router.post('/admin/signin', ClubUserController.signIn);

router.route('/admin/signup')
  .post(ClubUserController.signUp)
  .get(ClubUserController.validateNewField);

// Admins
router.post('/admin/signin', AdminUserController.signIn);

router.route('/admin/signup')
  .post(AdminUserController.signUp)
  .get(AdminUserController.validateNewField);

// events
router.route('/events/')
  .post(EventController.createEvent)
  .get(EventController.getAllEvents);

router.route('/review/')
  .get(EventController.getNonReviewedEvents);

router.route('/approved')
  .get(EventController.getApprovedEvents);

router.route('/approve/:id')
  .put(EventController.approveEvent);

router.route('/decline/:id')
  .put(EventController.declineEvent);

export default router;
