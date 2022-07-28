const authorization = (token: String) => {
  return {
    rejectUnauthorized: false,
    authorization: `Bearer ${token}`,
  };
};

export default authorization;
