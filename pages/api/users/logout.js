import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });
    await db.disconnect();
    if (user) {
        if (!req.body.cartItems)
        { user.cartItems = [] }
        else
        { user.cartItems = JSON.parse(req.body.cartItems); }
          
        await user.save();
        res.status(200).send({ message: 'Success'});
    } else {
      res.status(400).send({ message: `Unable to update user` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


export default handler;