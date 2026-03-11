
const User = mongoose.model("user", userSchema);

module.exports = {
  User,
  roles: {
    admin: 'admin',
    buyer: 'buyer',
    seller: 'seller',
    delivery:'delivery'
  }
}

