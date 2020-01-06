import { Router } from 'express';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import AnswerController from './app/controllers/AnswerController';
import authMiddleware from "./app/middleware/auth";

const routes = new Router();

routes.post("/sessions", SessionController.store);

routes.get("/students/:student_id/checkins", CheckinController.index);
routes.post("/students/:student_id/checkins", CheckinController.store);

routes.get("/students/:student_id/help-orders", HelpOrdersController.index);
routes.post("/students/:student_id/help-orders", HelpOrdersController.store);

routes.use(authMiddleware);

routes.post("/help-orders/:help_order/answer", AnswerController.store);

routes.post("/students", StudentController.store);
routes.put("/students", StudentController.update);

routes.get("/plans", PlanController.index);
routes.post("/plans", PlanController.store);
routes.put("/plans/:plan_id", PlanController.update);
routes.delete("/plans/:plan_id", PlanController.delete);

routes.get("/enrollments", EnrollmentController.index);
routes.post("/enrollments", EnrollmentController.store);
routes.put("/enrollments/:enrollment_id", EnrollmentController.update);
routes.delete("/enrollments/:enrollment_id", EnrollmentController.delete);

export default routes;
