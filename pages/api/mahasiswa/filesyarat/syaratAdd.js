import uploadMiddleware from './uploadMiddleware';
import handler from './handler';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {
  // Use the middleware
  await uploadMiddleware(req, res);

  // Use the handler
  handler(req, res);
}
