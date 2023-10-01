const UserModel = require('./user-model')
const userRepository = require('./user-repository')

const findById = async (id) => {
    return userRepository.findById(id)
}

const create = async (user) => {
    if (user.id) return user
    
    return userRepository.save(new UserModel(user))
}

const register = async (user, subscrption) => {
    user.webSubscription = subscrption

    return userRepository.save(user)
}

const subscribe = async (user, animeId) => {
    user.animeToNotify.push(animeId)
    user.animeToNotify = [...new Set(user.animeToNotify)]

    return userRepository.save(user)
}

const findByAnimeToNotify = async (animeId) => {
    return UserModel.find({ animeToNotify : { $in : [animeId] } })
}

module.exports = {
    create,
    subscribe,
    findById,
    register,
    findByAnimeToNotify
}