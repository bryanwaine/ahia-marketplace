import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.firstName,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.slice(7, authorization.length)
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({message: `Invalid token`})
      } else {
        req.user = decode
        next()
      }
    })
  } else {
    res.status(401).send({message: `no token found`})
  }
}

const isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
  next()
  } else {
    res.status(401).send({ message: `Admin access denied` });
  }
};

export { signToken, isAuth, isAdmin };
