import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import streamsRoutes from '../routes/streams.routes';
import reelsRoutes from '../routes/reels.routes';
import shopsRoutes from '../routes/shops.routes';
import usersRoutes from '../routes/users.routes';
import reviewsRoutes from '../routes/reviews.routes';
import reportsRoutes from '../routes/reports.routes';
import penaltiesRoutes from '../routes/penalties.routes';
import agendaRoutes from '../routes/agenda.routes';
import testPanelRoutes from '../routes/testpanel.routes';
import notificationsRoutes from '../routes/notifications.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/streams', streamsRoutes);
app.use('/reels', reelsRoutes);
app.use('/shops', shopsRoutes);
app.use('/users', usersRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/reports', reportsRoutes);
app.use('/penalties', penaltiesRoutes);
app.use('/agenda', agendaRoutes);
app.use('/testpanel', testPanelRoutes);
app.use('/notifications', notificationsRoutes);

export default app;