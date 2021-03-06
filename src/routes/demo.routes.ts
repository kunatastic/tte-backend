import { Request, Response, Router } from 'express';
import { IHelloMessage } from '../types/types';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  const helloMsg: IHelloMessage = { msg: 'Hello World' };
  res.json(helloMsg);
});

export default router;
